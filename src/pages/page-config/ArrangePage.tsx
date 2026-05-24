import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useMemo } from "react";
import {
  getAllPageConfigs,
  arrangePages,
} from "../../hooks/page-config/pageConfig";
import SectionLoader from "../../components/loader/SectionLoader";
import SectionError from "../../components/error/SectionError";
import Modal from "../../components/modal/Modal";
import PageConfigCard from "../../components/cards/PageConfigCard";
import type {
  PageConfig,
  ChildPage,
} from "../../types/page-config/pageConfigTypes";
import Header from "../../components/users/Header";
import Navbar from "../../components/nav/Navbar";

interface ApiResponse {
  configs: PageConfig[];
}

interface ModalState {
  show: boolean;
  success: boolean;
  message: string;
}

const PageConfigManager = () => {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<ModalState>({
    show: false,
    success: true,
    message: "",
  });
  const [expandedTabs, setExpandedTabs] = useState<Set<string>>(new Set());

  const { data, isLoading, error, refetch } = useQuery<ApiResponse>({
    queryKey: ["pageConfigs"],
    queryFn: getAllPageConfigs,
  });

  const arrangeMutation = useMutation({
    mutationFn: (items: { _id: string; order: number }[]) =>
      arrangePages({ items }),
    onSuccess: (responseData: string) => {
      setModal({
        show: true,
        success: true,
        message: responseData || "Order updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["pageConfigs"] });
    },
    onError: (err: Error) => {
      setModal({
        show: true,
        success: false,
        message: err.message || "Failed to update order",
      });
    },
  });

  const parentTabs = useMemo(() => {
    const configs = data?.configs || [];
    return configs.filter(
      (item: PageConfig) => item.type === "maintab" || item.type === "solo",
    );
  }, [data?.configs]);

  const handleMove = useCallback(
    (index: number, direction: "up" | "down") => {
      if (
        (direction === "up" && index === 0) ||
        (direction === "down" && index === parentTabs.length - 1)
      ) {
        return;
      }

      const newItems = [...parentTabs];
      const newIndex = direction === "up" ? index - 1 : index + 1;
      [newItems[index], newItems[newIndex]] = [
        newItems[newIndex],
        newItems[index],
      ];

      const updatedOrders = newItems.map((item, idx) => ({
        _id: item._id,
        order: idx + 1,
      }));
      arrangeMutation.mutate(updatedOrders);
    },
    [parentTabs, arrangeMutation],
  );

  const handleMoveChild = useCallback(
    (parentId: string, childIndex: number, direction: "up" | "down") => {
      const parentTab = parentTabs.find((tab) => tab._id === parentId);
      if (!parentTab?.childPages?.length) return;

      const childPages = [...parentTab.childPages] as ChildPage[];
      const newIndex = direction === "up" ? childIndex - 1 : childIndex + 1;

      if (
        (direction === "up" && childIndex === 0) ||
        (direction === "down" && childIndex === childPages.length - 1)
      ) {
        return;
      }

      [childPages[childIndex], childPages[newIndex]] = [
        childPages[newIndex],
        childPages[childIndex],
      ];

      const updatedOrders = childPages.map((child, idx) => ({
        _id: child._id,
        order: idx + 1,
      }));
      arrangeMutation.mutate(updatedOrders);
    },
    [parentTabs, arrangeMutation],
  );

  const toggleExpand = useCallback((id: string) => {
    setExpandedTabs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const closeModal = useCallback(() => {
    setModal({ show: false, success: true, message: "" });
  }, []);

  if (isLoading) return <SectionLoader />;

  if (error) {
    return <SectionError action={refetch} error={error?.message} />;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Header
          style="px-6 lg:px-0 py-6 bg-white"
          title="Arrange Pages"
          url="/page-configs"
          id=""
        />

        <div className="mb-8 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-800 text-center font-medium">
            Use the arrow buttons to reorder tabs and subtabs
          </p>
        </div>

        {parentTabs.length > 0 ? (
          <div className="space-y-4">
            {parentTabs.map((tab, index) => {
              const hasChildren =
                tab.type === "maintab" && !!tab.childPages?.length;
              const isExpanded = expandedTabs.has(tab._id);

              return (
                <div key={tab._id} className="relative">
                  <div className="flex gap-3">
                    <div className="flex flex-col gap-1.5 pt-4">
                      <button
                        onClick={() => handleMove(index, "up")}
                        disabled={index === 0}
                        className="w-9 h-9 flex items-center justify-center text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                        aria-label="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => handleMove(index, "down")}
                        disabled={index === parentTabs.length - 1}
                        className="w-9 h-9 flex items-center justify-center text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                        aria-label="Move down"
                      >
                        ↓
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      {hasChildren ? (
                        <div>
                          <div className="relative">
                            <button
                              onClick={() => toggleExpand(tab._id)}
                              className="absolute -right-2 -top-2 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg"
                              aria-label={isExpanded ? "Collapse" : "Expand"}
                            >
                              <span className="text-sm text-gray-600 hover:text-blue-600">
                                {isExpanded ? "−" : "+"}
                              </span>
                            </button>
                            <PageConfigCard
                              _id={tab._id}
                              type={tab.type}
                              keyName={tab.key}
                              displayName={tab.displayName}
                              pathLink={tab.pathLink}
                              order={tab.order}
                              isUnderMaintenance={tab.isUnderMaintenance}
                              childPages={tab.childPages as ChildPage[]}
                            />
                          </div>
                          {isExpanded && tab.childPages && (
                            <div className="mt-3 ml-8 space-y-2 border-l-2 border-gray-200 pl-5">
                              <div className="flex items-center gap-2 mb-3 ml-1">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                  {tab.childPages.length} Subpage
                                  {tab.childPages.length !== 1 ? "s" : ""}
                                </span>
                              </div>
                              {tab.childPages.map((child, childIndex) => (
                                <div key={child._id} className="relative group">
                                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
                                  <div className="flex gap-2 items-start">
                                    <div className="flex flex-col gap-1 pt-3">
                                      <button
                                        onClick={() =>
                                          handleMoveChild(
                                            tab._id,
                                            childIndex,
                                            "up",
                                          )
                                        }
                                        disabled={childIndex === 0}
                                        className="w-7 h-7 flex items-center justify-center text-gray-400 bg-white border border-gray-200 rounded hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                                        aria-label="Move subpage up"
                                      >
                                        ↑
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleMoveChild(
                                            tab._id,
                                            childIndex,
                                            "down",
                                          )
                                        }
                                        disabled={
                                          childIndex ===
                                          (tab.childPages?.length ?? 0) - 1
                                        }
                                        className="w-7 h-7 flex items-center justify-center text-gray-400 bg-white border border-gray-200 rounded hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                                        aria-label="Move subpage down"
                                      >
                                        ↓
                                      </button>
                                    </div>
                                    <div className="flex-1">
                                      <PageConfigCard
                                        _id={child._id}
                                        type={child.type}
                                        keyName={child.key}
                                        displayName={child.displayName}
                                        pathLink={child.pathLink}
                                        order={child.order}
                                        isUnderMaintenance={
                                          child.isUnderMaintenance
                                        }
                                        childPages={child.childPages || []}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <PageConfigCard
                          _id={tab._id}
                          type={tab.type}
                          keyName={tab.key}
                          displayName={tab.displayName}
                          pathLink={tab.pathLink}
                          order={tab.order}
                          isUnderMaintenance={tab.isUnderMaintenance}
                          childPages={(tab.childPages as ChildPage[]) || []}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-3">📄</div>
              <p className="text-sm text-gray-500">No results found</p>
            </div>
          </div>
        )}
      </div>

      {modal.show && (
        <Modal
          success={modal.success}
          message={modal.message}
          action={closeModal}
        />
      )}
    </>
  );
};

export default PageConfigManager;
