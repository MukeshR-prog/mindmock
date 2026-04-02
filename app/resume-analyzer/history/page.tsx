"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import { Pagination } from "@heroui/pagination";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useResumeStore } from "@/store/resumeStore";
import {
  DashboardNavbar,
  GradientText,
  ResumeIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ResumeHistorySkeleton,
} from "@/components";

interface ResumeItem {
  _id: string;
  fileName: string;
  targetRole?: string;
  experienceLevel?: string;
  atsScore: number;
  matchedKeywords?: string[];
  missingKeywords?: string[];
  createdAt: string;
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20];

export default function ResumeHistoryPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { setSelectedResume } = useResumeStore();
  const router = useRouter();

  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [scoreFilter, setScoreFilter] = useState<string>("all");

  // Filtered and paginated resumes
  const filteredResumes = useMemo(() => {
    return resumes.filter((resume) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        resume.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (resume.targetRole?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

      // Score filter
      let matchesScore = true;
      if (scoreFilter === "high") matchesScore = resume.atsScore >= 80;
      else if (scoreFilter === "medium") matchesScore = resume.atsScore >= 60 && resume.atsScore < 80;
      else if (scoreFilter === "low") matchesScore = resume.atsScore < 60;

      return matchesSearch && matchesScore;
    });
  }, [resumes, searchQuery, scoreFilter]);

  const totalPages = Math.ceil(filteredResumes.length / itemsPerPage);
  const paginatedResumes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredResumes.slice(start, start + itemsPerPage);
  }, [filteredResumes, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, scoreFilter, itemsPerPage]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchResumes = async () => {
      try {
        const res = await fetch("/api/resume/list", {
          headers: {
            firebaseUid: user.uid,
          },
        });
        const data = await res.json();
        setResumes(data.resumes || data);
      } catch (error) {
        console.error("Failed to fetch resumes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [user]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "danger";
  };

  const handleSelectResume = (resume: ResumeItem) => {
    setSelectedResume(resume);
    // Pass resumeId as a query param so the setup page can recover
    // the resume reference even if the Zustand store is cleared (e.g. refresh)
    router.push(`/interviews/setup?resumeId=${resume._id}`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar />
        <ResumeHistorySkeleton />
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
              <GradientText>Resume History</GradientText>
            </h1>
            <p className="text-foreground/60">
              View and manage your analyzed resumes.
            </p>
          </div>
          <Button
            color="primary"
            className="cursor-pointer"
            onPress={() => router.push("/resume-analyzer")}
            startContent={<ResumeIcon size={18} />}
          >
            Upload New Resume
          </Button>
        </motion.div>

        {/* Stats Overview */}
        {resumes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
          >
            <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
              <CardBody className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {resumes.length}
                </p>
                <p className="text-sm text-foreground/60">Total Resumes</p>
              </CardBody>
            </Card>
            <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
              <CardBody className="p-4 text-center">
                <p className="text-2xl font-bold text-success">
                  {resumes.length > 0
                    ? Math.round(
                        resumes.reduce((sum, r) => sum + r.atsScore, 0) /
                          resumes.length
                      )
                    : 0}
                  %
                </p>
                <p className="text-sm text-foreground/60">Avg ATS Score</p>
              </CardBody>
            </Card>
            <Card className="bg-content1/50 backdrop-blur-sm border border-divider">
              <CardBody className="p-4 text-center">
                <p className="text-2xl font-bold">
                  {resumes.length > 0
                    ? Math.max(...resumes.map((r) => r.atsScore))
                    : 0}
                  %
                </p>
                <p className="text-sm text-foreground/60">Best Score</p>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* Filters Section */}
        {resumes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <Input
              placeholder="Search by file name or role..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="flex-1"
              size="sm"
              isClearable
              onClear={() => setSearchQuery("")}
            />
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
        {resumes.length > 0 && filteredResumes.length !== resumes.length && (
          <p className="text-sm text-foreground/60 mb-4">
            Showing {filteredResumes.length} of {resumes.length} resumes
          </p>
        )}

        {/* Resume List */}
        {resumes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ResumeIcon size={40} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">No Resumes Yet</h2>
            <p className="text-foreground/60 mb-6 max-w-md mx-auto">
              Upload your first resume to get an ATS score and personalized
              improvement suggestions.
            </p>
            <Button
              color="primary"
              size="lg"
              className="cursor-pointer"
              onPress={() => router.push("/resume-analyzer")}
            >
              Upload Resume
            </Button>
          </motion.div>
        ) : filteredResumes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ResumeIcon size={40} className="text-primary" />
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
                setScoreFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedResumes.map((resume, index) => (
              <motion.div
                key={resume._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-content1/50 backdrop-blur-sm border border-divider hover:border-primary/30 transition-all">
                  <CardBody className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
                          <ResumeIcon size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">
                            {resume.fileName}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {resume.targetRole && (
                              <Chip size="sm" variant="flat">
                                {resume.targetRole}
                              </Chip>
                            )}
                            {resume.experienceLevel && (
                              <Chip size="sm" variant="bordered">
                                {resume.experienceLevel}
                              </Chip>
                            )}
                            <span className="text-sm text-foreground/60">
                              {new Date(resume.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {/* ATS Score Progress */}
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-foreground/60">ATS Score</span>
                              <span
                                className={`font-semibold text-${getScoreColor(
                                  resume.atsScore
                                )}`}
                              >
                                {resume.atsScore}%
                              </span>
                            </div>
                            <Progress
                              value={resume.atsScore}
                              color={getScoreColor(resume.atsScore)}
                              size="sm"
                              className="max-w-full"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 md:flex-shrink-0">
                        <Button
                          color="primary"
                          variant="flat"
                          size="sm"
                          className="cursor-pointer"
                          endContent={<ArrowRightIcon size={16} />}
                          onPress={() => handleSelectResume(resume)}
                        >
                          Start Interview
                        </Button>
                      </div>
                    </div>

                    {/* Keywords Preview */}
                    {resume.matchedKeywords && resume.matchedKeywords.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-divider">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-foreground/60">
                            Matched:
                          </span>
                          {resume.matchedKeywords.slice(0, 5).map((keyword, idx) => (
                            <Chip
                              key={`matched-${resume._id}-${idx}-${keyword}`}
                              size="sm"
                              color="success"
                              variant="flat"
                            >
                              {keyword}
                            </Chip>
                          ))}
                          {resume.matchedKeywords.length > 5 && (
                            <span className="text-xs text-foreground/60">
                              +{resume.matchedKeywords.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
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
