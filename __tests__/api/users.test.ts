/**
 * Jest Tests for POST /api/users  (Login / User-sync API)
 *
 * Isolation strategy:
 *  - connectDB  → jest.mock (no real Mongo connection)
 *  - User model → jest.mock (controlled findOne / create)
 *  - NextResponse.json → mocked via jest.mock to return a plain
 *    { body, status } object so we can inspect the return value of POST()
 */

// ─── Mocks BEFORE imports ─────────────────────────────────────────────────────

jest.mock("@/config/mongodb", () => ({
  connectDB: jest.fn().mockResolvedValue(undefined),
}));

const mockFindOne = jest.fn();
const mockCreate = jest.fn();

jest.mock("@/models/User", () => ({
  __esModule: true,
  default: {
    findOne: (...args: any[]) => mockFindOne(...args),
    create: (...args: any[]) => mockCreate(...args),
  },
}));

/**
 * Key insight: jest.mock factory must return the mock synchronously.
 * We use a module-level implementation so the SAME mock fn is used
 * each time, but its implementation is replaced per-test via mockImplementation.
 */
const nextResponseJsonMock = jest.fn();

jest.mock("next/server", () => ({
  NextResponse: {
    json: (...args: any[]) => nextResponseJsonMock(...args),
  },
}));

// ─── Imports (after mocks) ────────────────────────────────────────────────────

import { POST } from "@/app/api/users/route";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeRequest(body: Record<string, unknown>): Request {
  return { json: jest.fn().mockResolvedValue(body) } as unknown as Request;
}

/** Standard mock implementation: return a plain {body, status} object */
function setupJsonMock() {
  nextResponseJsonMock.mockImplementation(
    (body: any, init?: { status?: number }) => ({
      body,
      status: init?.status ?? 200,
    })
  );
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const VALID_PAYLOAD = {
  firebaseUid: "uid_test_001",
  email: "john@example.com",
  name: "John Doe",
  provider: "google",
};

const EXISTING_USER = {
  _id: "64abc000000000000000001",
  ...VALID_PAYLOAD,
  role: "user",
  totalInterviews: 5,
  avgScore: 72,
};

const NEW_USER = {
  _id: "64abc000000000000000002",
  ...VALID_PAYLOAD,
  role: "user",
  totalInterviews: 0,
  avgScore: 0,
};

// ─── Suite ────────────────────────────────────────────────────────────────────

describe("POST /api/users  (Login / User-sync API)", () => {
  beforeEach(() => {
    // Reset call history but keep implementations alive
    nextResponseJsonMock.mockReset();
    mockFindOne.mockReset();
    mockCreate.mockReset();

    // Reset connectDB mock to default (resolve ok)
    const { connectDB } = require("@/config/mongodb");
    (connectDB as jest.Mock).mockReset();
    (connectDB as jest.Mock).mockResolvedValue(undefined);

    // Default json mock implementation
    setupJsonMock();
  });

  // ── Happy Path ────────────────────────────────────────────────────────────

  describe("✅ Happy Path", () => {
    it("returns existing user when firebaseUid already exists in DB", async () => {
      mockFindOne.mockResolvedValueOnce(EXISTING_USER);

      const req = makeRequest(VALID_PAYLOAD);
      await POST(req);

      const { connectDB } = require("@/config/mongodb");
      expect(connectDB).toHaveBeenCalledTimes(1);

      expect(mockFindOne).toHaveBeenCalledWith({
        firebaseUid: VALID_PAYLOAD.firebaseUid,
      });

      // For an existing user, create must NOT be called
      expect(mockCreate).not.toHaveBeenCalled();

      // Response body should be the user object
      expect(nextResponseJsonMock).toHaveBeenCalledWith(EXISTING_USER);
    });

    it("creates and returns a new user when firebaseUid is not in DB", async () => {
      mockFindOne.mockResolvedValueOnce(null);
      mockCreate.mockResolvedValueOnce(NEW_USER);

      const req = makeRequest(VALID_PAYLOAD);
      await POST(req);

      expect(mockFindOne).toHaveBeenCalledWith({
        firebaseUid: VALID_PAYLOAD.firebaseUid,
      });
      expect(mockCreate).toHaveBeenCalledWith({
        firebaseUid: VALID_PAYLOAD.firebaseUid,
        email: VALID_PAYLOAD.email,
        name: VALID_PAYLOAD.name,
        provider: VALID_PAYLOAD.provider,
      });
      expect(nextResponseJsonMock).toHaveBeenCalledWith(NEW_USER);
    });

    it("returns HTTP 200 status for an existing user", async () => {
      mockFindOne.mockResolvedValueOnce(EXISTING_USER);

      const res = (await POST(makeRequest(VALID_PAYLOAD))) as any;

      expect(res.status).toBe(200);
      expect(res.body).toEqual(EXISTING_USER);
    });

    it("returns HTTP 200 status for a newly created user", async () => {
      mockFindOne.mockResolvedValueOnce(null);
      mockCreate.mockResolvedValueOnce(NEW_USER);

      const res = (await POST(makeRequest(VALID_PAYLOAD))) as any;

      expect(res.status).toBe(200);
      expect(res.body).toEqual(NEW_USER);
    });

    it("works with provider='email' (username/password login)", async () => {
      const emailPayload = { ...VALID_PAYLOAD, provider: "email" };
      const emailUser = { ...NEW_USER, provider: "email" };

      mockFindOne.mockResolvedValueOnce(null);
      mockCreate.mockResolvedValueOnce(emailUser);

      await POST(makeRequest(emailPayload));

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ provider: "email" })
      );
      expect(nextResponseJsonMock).toHaveBeenCalledWith(emailUser);
    });

    it("works when optional 'name' field is absent", async () => {
      const noName = { ...VALID_PAYLOAD, name: undefined };
      const noNameUser = { _id: "64abc999", ...noName };

      mockFindOne.mockResolvedValueOnce(null);
      mockCreate.mockResolvedValueOnce(noNameUser);

      await POST(makeRequest(noName));

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ email: VALID_PAYLOAD.email })
      );
    });
  });

  // ── Error Handling ────────────────────────────────────────────────────────

  describe("❌ Error Handling", () => {
    it("returns 500 when connectDB throws", async () => {
      const { connectDB } = require("@/config/mongodb");
      (connectDB as jest.Mock).mockRejectedValueOnce(
        new Error("DB connection failed")
      );

      const res = (await POST(makeRequest(VALID_PAYLOAD))) as any;

      expect(res.status).toBe(500);
      expect(nextResponseJsonMock).toHaveBeenCalledWith(
        { error: "User creation failed" },
        { status: 500 }
      );
    });

    it("returns 500 when User.findOne throws", async () => {
      mockFindOne.mockRejectedValueOnce(new Error("findOne blew up"));

      const res = (await POST(makeRequest(VALID_PAYLOAD))) as any;

      expect(res.status).toBe(500);
      expect(nextResponseJsonMock).toHaveBeenCalledWith(
        { error: "User creation failed" },
        { status: 500 }
      );
    });

    it("returns 500 when User.create throws (e.g. duplicate key)", async () => {
      mockFindOne.mockResolvedValueOnce(null);
      mockCreate.mockRejectedValueOnce(new Error("E11000 duplicate key"));

      const res = (await POST(makeRequest(VALID_PAYLOAD))) as any;

      expect(res.status).toBe(500);
      expect(nextResponseJsonMock).toHaveBeenCalledWith(
        { error: "User creation failed" },
        { status: 500 }
      );
    });

    it("returns 500 when req.json() throws (malformed request body)", async () => {
      const badReq = {
        json: jest.fn().mockRejectedValue(new SyntaxError("Unexpected token")),
      } as unknown as Request;

      const res = (await POST(badReq)) as any;

      expect(res.status).toBe(500);
      expect(nextResponseJsonMock).toHaveBeenCalledWith(
        { error: "User creation failed" },
        { status: 500 }
      );
    });
  });

  // ── Edge Cases ────────────────────────────────────────────────────────────

  describe("🔍 Input / Edge Cases", () => {
    it("uses the firebaseUid from the request body for the DB lookup", async () => {
      const custom = { ...VALID_PAYLOAD, firebaseUid: "custom_uid_xyz" };
      mockFindOne.mockResolvedValueOnce(null);
      mockCreate.mockResolvedValueOnce({ ...NEW_USER, firebaseUid: "custom_uid_xyz" });

      await POST(makeRequest(custom));

      expect(mockFindOne).toHaveBeenCalledWith({ firebaseUid: "custom_uid_xyz" });
    });

    it("never calls User.create when the user already exists", async () => {
      mockFindOne.mockResolvedValueOnce(EXISTING_USER);

      await POST(makeRequest(VALID_PAYLOAD));

      expect(mockCreate).not.toHaveBeenCalled();
    });

    it("always calls connectDB before any model operation", async () => {
      mockFindOne.mockResolvedValueOnce(EXISTING_USER);
      const { connectDB } = require("@/config/mongodb");

      await POST(makeRequest(VALID_PAYLOAD));

      expect(connectDB).toHaveBeenCalled();

      const connectOrder = (connectDB as jest.Mock).mock.invocationCallOrder[0];
      const findOrder = mockFindOne.mock.invocationCallOrder[0];
      expect(connectOrder).toBeLessThan(findOrder);
    });

    it("passes empty string fields to the model without validation", async () => {
      const empty = { firebaseUid: "", email: "", name: "", provider: "" };
      mockFindOne.mockResolvedValueOnce(null);
      mockCreate.mockResolvedValueOnce({ _id: "64abc888", ...empty });

      await POST(makeRequest(empty));

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ firebaseUid: "", email: "" })
      );
    });

    it("response body contains all expected fields for an existing user", async () => {
      mockFindOne.mockResolvedValueOnce(EXISTING_USER);

      const res = (await POST(makeRequest(VALID_PAYLOAD))) as any;

      expect(res.body).toMatchObject({
        _id: EXISTING_USER._id,
        firebaseUid: EXISTING_USER.firebaseUid,
        email: EXISTING_USER.email,
        name: EXISTING_USER.name,
        provider: EXISTING_USER.provider,
        totalInterviews: EXISTING_USER.totalInterviews,
        avgScore: EXISTING_USER.avgScore,
      });
    });
  });
});
