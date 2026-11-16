import React, { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export const ContainerScroll = ({ titleComponent, children }) => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Góc nghiêng 3D duỗi thẳng về 0 độ
    const rotateX = useTransform(scrollYProgress, [0, 0.55], [20, 0]);

    // Phóng từ kích thước thẻ lơ lửng ra toàn màn hình tràn viền
    const scale = useTransform(
        scrollYProgress,
        [0, 1.0],
        isMobile ? [0.88, 1.0] : [0.76, 1.0]
    );

    // Bo góc từ 36px về 0px (tràn viền màn hình)
    const borderRadius = useTransform(scrollYProgress, [0.35, 1.0], ["36px", "0px"]);

    // Độ mờ của viền và bóng đổ (dùng opacity thuần GPU, không gây giật lag)
    const chromeOpacity = useTransform(scrollYProgress, [0.4, 0.95], [1, 0]);

    // Tiêu đề phía trên mờ dần và trượt lên khi phóng to
    const headerOpacity = useTransform(scrollYProgress, [0.05, 0.35], [1, 0]);
    const headerY = useTransform(scrollYProgress, [0.05, 0.35], [0, -60]);

    return (
        <div
            ref={containerRef}
            style={{
                height: isMobile ? "160vh" : "180vh",
                position: "relative",
                width: "100%",
            }}
        >
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    width: "100%",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    perspective: "1200px",
                }}
            >
                {/* Tiêu đề giới thiệu bảo tàng */}
                <motion.div
                    style={{
                        opacity: headerOpacity,
                        y: headerY,
                        width: "100%",
                        maxWidth: "1360px",
                        padding: isMobile ? "0 1.25rem" : "0 3.5rem",
                        position: "absolute",
                        top: isMobile ? "2.5vh" : "5vh",
                        zIndex: 2,
                        pointerEvents: "none",
                        willChange: "transform, opacity",
                    }}
                >
                    {titleComponent}
                </motion.div>

                {/* Khung thẻ 3D phóng toàn màn hình */}
                <motion.div
                    style={{
                        rotateX,
                        scale,
                        borderRadius,
                        width: "100%",
                        height: "100vh",
                        overflow: "hidden",
                        backgroundColor: "#0d0d0d",
                        position: "relative",
                        zIndex: 1,
                        transformOrigin: "center center",
                        willChange: "transform",
                    }}
                >
                    {/* Layer viền và bóng đổ tablet (mờ dần khi tràn viền) */}
                    <motion.div
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "inherit",
                            border: "3px solid rgba(255, 255, 255, 0.12)",
                            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.65)",
                            pointerEvents: "none",
                            zIndex: 15,
                            opacity: chromeOpacity,
                            willChange: "opacity",
                        }}
                    />

                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            overflow: "hidden",
                            borderRadius: "inherit",
                        }}
                    >
                        {children}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ContainerScroll;
