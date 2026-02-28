import React from "react";


function BlogsShowcase() {
    return (
        <>


            {/* Blog posts section */}
            <section
                style={{
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "#080910",
                    padding: "1.75rem 1.75rem 1.9rem",
                    height: "100vh"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: 16,
                    }}
                >
                    <div
                        style={{
                            fontSize: 14,
                            letterSpacing: 4,
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.6)",
                        }}
                    >
                        Blog
                    </div>
                    <div
                        style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.45)",
                        }}
                    >
                        Static previews · not yet clickable
                    </div>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1.1fr)",
                        gap: 16,
                        flexWrap: "wrap",
                    }}
                >
                    {/* Raspberry Pi blog card */}
                    <article
                        style={{
                            borderRadius: 8,
                            border: "1px solid rgba(255,255,255,0.1)",
                            background:
                                "radial-gradient(circle at top left, rgba(0,255,163,0.16), transparent 65%), #050609",
                            padding: "1.3rem 1.2rem 1.35rem",
                            opacity: 0.9,
                            cursor: "default",
                        }}
                    >
                        <div
                            style={{
                                fontSize: 12,
                                textTransform: "uppercase",
                                letterSpacing: 3,
                                color: "rgba(15,217,128,0.9)",
                                marginBottom: 6,
                            }}
                        >
                            Raspberry Pi
                        </div>
                        <div
                            style={{
                                fontSize: 18,
                                fontWeight: 600,
                                marginBottom: 6,
                            }}
                        >
                            Raspberry Pi Projects
                        </div>
                        <p
                            style={{
                                fontSize: 14,
                                lineHeight: 1.7,
                                color: "rgba(255,255,255,0.8)",
                            }}
                        >
                            A tour of small but powerful builds you can do with a Raspberry
                            Pi—from self-hosted dashboards to tiny retro gaming rigs.
                            This card is just a preview for now.
                        </p>
                    </article>

                    {/* GPU comparison blog card */}
                    <article
                        style={{
                            borderRadius: 8,
                            border: "1px solid rgba(255,255,255,0.1)",
                            background:
                                "radial-gradient(circle at top left, rgba(120,151,255,0.18), transparent 70%), #050609",
                            padding: "1.3rem 1.2rem 1.35rem",
                            opacity: 0.9,
                            cursor: "default",
                        }}
                    >
                        <div
                            style={{
                                fontSize: 12,
                                textTransform: "uppercase",
                                letterSpacing: 3,
                                color: "rgba(180,198,255,0.92)",
                                marginBottom: 6,
                            }}
                        >
                            GPU Deep Dive
                        </div>
                        <div
                            style={{
                                fontSize: 16,
                                fontWeight: 600,
                                marginBottom: 6,
                            }}
                        >
                            Which is better: 3090 or 4090 RTX Ti?
                        </div>
                        <p
                            style={{
                                fontSize: 13,
                                lineHeight: 1.6,
                                color: "rgba(255,255,255,0.75)",
                            }}
                        >
                            A high-level look at power, performance, and value between
                            NVIDIA's 3090 and 4090 class cards. This section will later
                            link to a full breakdown, but for now it's just a static
                            snapshot.
                        </p>
                    </article>
                </div>
            </section>



        </>




    )


}

export default BlogsShowcase