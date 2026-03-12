"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";
import { motion } from "framer-motion";
import {
  DashboardNavbar,
  GradientText,
  MicrophoneIcon,
  ChartIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  InterviewHistorySkeleton,
} from "@/components";

interface InterviewItem {
  _id: string;
  createdAt: string;
  status: string;
  targetRole?: string;
  overallScore?: number;
  interviewType?: string;
  interviewMode?: string;
  selectedConcepts?: string[];
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20];

export default function InterviewHistoryPage() {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [interviews, setInterviews] = useState<InterviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [scoreFilter, setScoreFilter] = useState<string>("all");

  // Filtered and paginated interviews
  const filteredInterviews = useMemo(() => {
    return interviews.filter((interview) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        (interview.targetRole?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (interview.interviewType?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

      // Status filter
      let matchesStatus = true;
      if (statusFilter !== "all") matchesStatus = interview.status === statusFilter;

      // Score filter
      let matchesScore = true;
      if (interview.overallScore !== undefined) {
        if (scoreFilter === "high") matchesScore = interview.overallScore >= 80;
        else if (scoreFilter === "medium") matchesScore = interview.overallScore >= 60 && interview.overallScore < 80;
        else if (scoreFilter === "low") matchesScore = interview.overallScore < 60;
      } else if (scoreFilter !== "all") {
        matchesScore = false;
      }

      return matchesSearch && matchesStatus && matchesScore;
    });
  }, [interviews, searchQuery, statusFilter, scoreFilter]);

  const totalPages = Math.ceil(filteredInterviews.length / itemsPerPage);
  const paginatedInterviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInterviews.slice(start, start + itemsPerPage);
  }, [filteredInterviews, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, scoreFilter, itemsPerPage]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchInterviews = async () => {
      try {
        const res = await fetch("/api/interviews/list", {
          headers: {
            firebaseUid: user.uid,
          },
        });
        const data = await res.json();
        setInterviews(data.interviews || data);
      } catch (error) {
        console.error("Failed to fetch interviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "warning";
      default:
        return "default";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-danger";
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar />
        <InterviewHistorySkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <Button
            variant="light"
            size="sm"
            startContent={<ArrowLeftIcon size={18} />}
            onPress={() => router.push("/dashboard")}
            className="text-foreground/60 hover:text-foreground cursor-pointer"
          >
            Back to Dashboard
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              <GradientText>Interview History</GradientText>
            </h1>
            <p className="text-foreground/60">
              Review your past interviews and track your progress.
            </p>
          </div>
          <Button
            color="primary"
            className="cursor-pointer"
            onPress={() => router.push("/interviews/setup")}
            startContent={<MicrophoneIcon size={18} />}
          >
            New Interview
          </Button>
        </motion.div>

        {/* Stats Overview */}
        {interviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
              <CardBody className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {interviews.length}
                </p>
                <p className="text-sm text-foreground/60">Total Interviews</p>
              </CardBody>
            </Card>
            <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
              <CardBody className="p-4 text-center">
                <p className="text-2xl font-bold text-success">
                  {interviews.filter((i) => i.status === "completed").length}
                </p>
                <p className="text-sm text-foreground/60">Completed</p>
              </CardBody>
            </Card>
            <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
              <CardBody className="p-4 text-center">
                <p className="text-2xl font-bold text-warning">
                  {interviews.filter((i) => i.status === "in-progress").length}
                </p>
                <p className="text-sm text-foreground/60">In Progress</p>
              </CardBody>
            </Card>
            <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
              <CardBody className="p-4 text-center">
                <p className="text-2xl font-bold">
                  {interviews.length > 0
                    ? Math.round(
                        interviews
                          .filter((i) => i.overallScore)
                          .reduce((sum, i) => sum + (i.overallScore || 0), 0) /
                          interviews.filter((i) => i.overallScore).length || 0
                      )
                    : 0}
                  %
                </p>
                <p className="text-sm text-foreground/60">Avg Score</p>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* Filters Section */}
        {interviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <Input
              placeholder="Search by role or type..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="flex-1"
              size="sm"
              isClearable
              onClear={() => setSearchQuery("")}
            />
            <Select
              label="Status"
              selectedKeys={[statusFilter]}
              onChange={(e) => setStatusFilter(e.target.value || "all")}
              className="w-full sm:w-40"
              size="sm"
            >
              <SelectItem key="all">All Status</SelectItem>
              <SelectItem key="completed">Completed</SelectItem>
              <SelectItem key="in-progress">In Progress</SelectItem>
            </Select>
            <Select
              label="Score Filter"
              selectedKeys={[scoreFilter]}
              onChange={(e) => setScoreFilter(e.target.value || "all")}
              className="w-full sm:w-40"
              size="sm"
            >
              <SelectItem key="all">All Scores</SelectItem>
              <SelectItem key="high">High (80%+)</SelectItem>
              <SelectItem key="medium">Medium (60-79%)</SelectItem>
              <SelectItem key="low">Low (&lt;60%)</SelectItem>
            </Select>
            <Select
              label="Per Page"
              selectedKeys={[String(itemsPerPage)]}
              onChange={(e) => setItemsPerPage(Number(e.target.value) || 10)}
              className="w-full sm:w-32"
              size="sm"
            >
              {ITEMS_PER_PAGE_OPTIONS.map((num) => (
                <SelectItem key={String(num)}>{num}</SelectItem>
              ))}
            </Select>
          </motion.div>
        )}

        {/* Results count */}
        {interviews.length > 0 && filteredInterviews.length !== interviews.length && (
          <p className="text-sm text-foreground/60 mb-4">
            Showing {filteredInterviews.length} of {interviews.length} interviews
          </p>
        )}

        {/* Interview List */}
        {interviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <MicrophoneIcon size={40} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">No Interviews Yet</h2>
            <p className="text-foreground/60 mb-6 max-w-md mx-auto">
              Start your first mock interview to practice and improve your
              interview skills.
            </p>
            <Button
              color="primary"
              size="lg"
              className="cursor-pointer"
              onPress={() => router.push("/resume-analyzer")}
            >
              Get Started
            </Button>
          </motion.div>
        ) : filteredInterviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <MicrophoneIcon size={40} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">No Results Found</h2>
            <p className="text-foreground/60 mb-6 max-w-md mx-auto">
              Try adjusting your search or filter criteria.
            </p>
            <Button
              color="primary"
              variant="flat"
              className="cursor-pointer"
              onPress={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setScoreFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedInterviews.map((interview, index) => (
                <motion.div
                  key={interview._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="bg-content1/50 backdrop-blur-sm border border-divider hover:border-primary/30 transition-all group">
                    <CardBody className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            <MicrophoneIcon size={24} />
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {interview.targetRole || "Mock Interview"}
                            </h3>
                            <p className="text-sm text-foreground/60">
                              {new Date(interview.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <Chip
                                size="sm"
                                color={getStatusColor(interview.status)}
                                variant="flat"
                              >
                                {interview.status}
                              </Chip>
                              {interview.interviewMode === "concept-based" && (
                                <Chip size="sm" color="secondary" variant="flat">
                                  Concept-Based
                                </Chip>
                              )}
                              {interview.interviewType && (
                                <Chip size="sm" variant="bordered">
                                  {interview.interviewType}
                                </Chip>
                              )}
                              {interview.selectedConcepts && interview.selectedConcepts.length > 0 && (
                                <span className="text-xs text-foreground/50">
                                  Topics: {interview.selectedConcepts.slice(0, 3).map(c => c.toUpperCase()).join(", ")}
                                  {interview.selectedConcepts.length > 3 && ` +${interview.selectedConcepts.length - 3} more`}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {interview.overallScore !== undefined && (
                            <div className="text-right">
                              <p className="text-sm text-foreground/60">Score</p>
                              <p
                                className={`text-2xl font-bold ${getScoreColor(
                                  interview.overallScore
                                )}`}
                              >
                                {interview.overallScore}%
                              </p>
                            </div>
                          )}
                          <Button
                            color="primary"
                            variant={
                              interview.status === "completed" ? "flat" : "solid"
                            }
                            size="sm"
                            className="cursor-pointer"
                            endContent={<ArrowRightIcon size={16} />}
                            onPress={() =>
                              router.push(
                                interview.status === "completed"
                                  ? `/interviews/${interview._id}/feedback`
                                  : `/interviews/${interview._id}/live`
                              )
                            }
                          >
                            {interview.status === "completed"
                              ? "View Feedback"
                              : "Continue"}
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
              </motion.div>
            ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex justify-center mt-8"
              >
                <Pagination
                  total={totalPages}
                  page={currentPage}
                  onChange={setCurrentPage}
                  showControls
                  color="primary"
                  size="lg"
                />
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
