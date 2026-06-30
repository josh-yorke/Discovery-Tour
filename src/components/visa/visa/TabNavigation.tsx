import { useState, useEffect, useCallback, useRef, useMemo } from "react";

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;
}

interface TabNavigationProps {
  items: TabItem[];
  sectionIds?: string[];
  className?: string;
  headerHeight?: number;
}

const TabNavigation = ({
  items,
  sectionIds,
  className = "",
  headerHeight = 80,
}: TabNavigationProps) => {
  const [activeSection, setActiveSection] = useState(items[0]?.id || "");
  const timeoutRef = useRef<number | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const targetIds = useMemo(
    () => sectionIds || items.map((item) => item.id),
    [sectionIds, items],
  );

  const handleTabClick = useCallback(
    (sectionId: string) => {
      const section = document.getElementById(sectionId);
      if (!section) {
        console.error("Section not found:", sectionId);
        return;
      }

      const sectionTop = section.offsetTop - headerHeight;
      window.scrollTo({ top: sectionTop, behavior: "smooth" });
      setActiveSection(sectionId);
    },
    [headerHeight],
  );

  const findActiveSection = useCallback(
    (scrollPosition: number) => {
      let activeId = "";
      let closestDistance = Infinity;

      targetIds.forEach((id) => {
        const section = document.getElementById(id);
        if (!section) return;

        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        const distance = Math.abs(scrollPosition - sectionTop);

        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
          activeId = id;
        } else if (distance < closestDistance) {
          closestDistance = distance;
          if (!activeId) {
            activeId = id;
          }
        }
      });

      return activeId || items[0]?.id || "";
    },
    [targetIds, items],
  );

  const handleScroll = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      const scrollY = window.scrollY;
      const scrollPosition = scrollY + 100;

      const newActiveSection = findActiveSection(scrollPosition);
      if (newActiveSection && newActiveSection !== activeSection) {
        setActiveSection(newActiveSection);
      }
    }, 50);
  }, [findActiveSection, activeSection]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [handleScroll]);

  const navClasses = `sticky top-34 w-full flex justify-center z-sticky2 ${className}`;
  const containerClasses = `bg-black/20 border-[0.5px] border-black/20 backdrop-blur-sm shadow-xl shadow-black/6 rounded-full inline-flex py-3 px-4`;
  const innerContainerClasses = `flex items-center gap-4`;

  return (
    <nav
      ref={navRef}
      className={navClasses}
      role="navigation"
      aria-label="Section navigation"
    >
      <div className={containerClasses}>
        <div className={innerContainerClasses}>
          {items.map((item) => {
            const isActive = activeSection === item.id;

            const buttonClasses = `flex items-center justify-center whitespace-nowrap cursor-pointer p-2 rounded-full hover:bg-black/20 text-white`;

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={buttonClasses}
                aria-current={isActive ? "page" : undefined}
                title={item.label}
                type="button"
              >
                <div aria-hidden="true">
                  {isActive ? item.icon : item.activeIcon || item.icon}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default TabNavigation;
