import {
  RiFolder3Fill,
  RiLayoutRight2Fill,
  RiMoneyCnyCircleFill,
  RiQuestionFill,
  RiShoppingBasketFill,
  RiTimer2Fill,
  RiArrowDownSLine,
} from "react-icons/ri";
import { useState } from "react";

export type FormType =
  | "pricelist"
  | "process"
  | "payment"
  | "term"
  | "document"
  | "faq";

interface FormTabsProps {
  formType: FormType;
  setFormType: (type: FormType) => void;
}

const FormTabs: React.FC<FormTabsProps> = ({ formType, setFormType }) => {
  const [showSheet, setShowSheet] = useState(false);

  const tabs = [
    {
      id: "pricelist" as const,
      icon: RiShoppingBasketFill,
      label: "Pricelist",
      description: "Pricing",
    },
    {
      id: "process" as const,
      icon: RiTimer2Fill,
      label: "Process",
      description: "How it works",
    },
    {
      id: "payment" as const,
      icon: RiMoneyCnyCircleFill,
      label: "Payment",
      description: "Methods",
    },
    {
      id: "term" as const,
      icon: RiLayoutRight2Fill,
      label: "Terms",
      description: "Conditions",
    },
    {
      id: "document" as const,
      icon: RiFolder3Fill,
      label: "Documents",
      description: "Required docs",
    },
    {
      id: "faq" as const,
      icon: RiQuestionFill,
      label: "FAQs",
      description: "Questions",
    },
  ];

  const activeTab = tabs.find((tab) => tab.id === formType) || tabs[0];

  const handleSelect = (tabId: FormType) => {
    setFormType(tabId);
    setShowSheet(false);
    if (navigator.vibrate) navigator.vibrate(50);
  };

  return (
    <div className="w-full flex justify-center mb-6">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="block md:hidden">
          <button
            onClick={() => setShowSheet(true)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white rounded-xl shadow-md border border-gray-200 active:scale-[0.99] transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-linear-to-br from-[#1d2087] to-[#2a2ea8] rounded-lg">
                <activeTab.icon size={18} className="text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">
                  {activeTab.label}
                </div>
                <div className="text-xs text-gray-500">
                  {activeTab.description}
                </div>
              </div>
            </div>
            <RiArrowDownSLine
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${showSheet ? "rotate-180" : ""}`}
            />
          </button>

          {showSheet && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
                onClick={() => setShowSheet(false)}
              />
              <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-12 h-1 bg-gray-300 rounded-full" />
                </div>

                <div className="px-5 pb-3 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Select Section
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Choose what you want to edit
                  </p>
                </div>

                <div className="max-h-[60vh] overflow-y-auto py-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = formType === tab.id;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleSelect(tab.id)}
                        className={`w-full flex items-center gap-3 px-5 py-3.5 transition-all duration-200 ${
                          isActive ? "bg-[#1d2087]/5" : "hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-xl transition-all duration-200 ${
                            isActive
                              ? "bg-[#1d2087] text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 text-left">
                          <div
                            className={`font-medium ${isActive ? "text-[#1d2087]" : "text-gray-900"}`}
                          >
                            {tab.label}
                          </div>
                          <div className="text-xs text-gray-500">
                            {tab.description}
                          </div>
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 bg-[#1d2087] rounded-full animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="p-4 pb-6 border-t border-gray-100">
                  <button
                    onClick={() => setShowSheet(false)}
                    className="w-full py-3 text-gray-600 font-medium bg-gray-100 rounded-xl active:scale-[0.98] transition-all duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="hidden md:flex justify-center">
          <div className="inline-flex flex-wrap justify-center gap-2 p-1.5 bg-linear-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-100/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = formType === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelect(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#1d2087]/50 ${
                    isActive
                      ? "text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                  }`}
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, #1d2087 0%, #2a2ea8 100%)`
                      : "transparent",
                  }}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormTabs;
