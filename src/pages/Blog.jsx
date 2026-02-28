import React from "react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "Top 10 GPU Benchmarks for 2024: Which Card Reigns Supreme?",
    date: "February 15, 2024",
    excerpt: "Dive deep into the latest GPU benchmarks comparing NVIDIA RTX 40-series, AMD RX 7000-series, and Intel Arc GPUs across gaming, rendering, and AI workloads.",
    image: "https://picsum.photos/400/250",
    readTime: "8 min read",
    category: "Hardware Reviews"
  }
];

function Blog() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "3rem 2.5rem",
        background: "#050608",
        color: "#f5f5f5",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: 48, marginBottom: 16, fontWeight: 800, letterSpacing: -1, fontFamily: "'Orbitron', sans-serif" }}>
          Tech Blog
        </h1>
        <p style={{ fontSize: 18, opacity: 0.8, marginBottom: 48, lineHeight: 1.6, fontFamily: "'Orbitron', sans-serif" }}>
          Insights, guides, and reviews from the world of PC building, gaming hardware, and emerging tech.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "2rem"
        }}>
          {blogPosts.map(post => (
            <Link key={post.id} to={`/blog/${post.id}`} style={{ textDecoration: 'none' }}>
              <article
                style={{
                  background: "#0A0C10",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  cursor: "pointer"
                }}
              >
              <img
                src={post.image}
                alt={post.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
              <div style={{ padding: "24px" }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px"
                }}>
                  <span style={{
                    background: "rgba(15,217,128,0.1)",
                    color: "#0FD980",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 600
                  }}>
                    {post.category}
                  </span>
                  <span style={{
                    fontSize: "14px",
                    opacity: 0.6
                  }}>
                    {post.readTime}
                  </span>
                </div>
                <h2 style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  marginBottom: "12px",
                  lineHeight: 1.4
                }}>
                  {post.title}
                </h2>
                <p style={{
                  fontSize: "16px",
                  opacity: 0.8,
                  lineHeight: 1.6,
                  marginBottom: "16px"
                }}>
                  {post.excerpt}
                </p>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span style={{
                    fontSize: "14px",
                    opacity: 0.6
                  }}>
                    {post.date}
                  </span>
                  <span style={{
                    color: "#0FD980",
                    fontSize: "14px",
                    fontWeight: 600
                  }}>
                    Read More →
                  </span>
                </div>
              </div>
            </article>
            </Link>
          ))}
        </div>

        <div style={{
          textAlign: "center",
          marginTop: "4rem",
          padding: "3rem",
          background: "rgba(15,217,128,0.05)",
          border: "1px solid rgba(15,217,128,0.2)",
          borderRadius: "12px"
        }}>
          <h3 style={{ fontSize: 24, marginBottom: 16, color: "#0FD980", fontFamily: "'Orbitron', sans-serif", fontWeight:"700" }}>
            Stay Updated
          </h3>
          <p style={{ fontSize: 16, opacity: 0.8, marginBottom: 24 }}>
            Subscribe to our newsletter for the latest in PC building tips, hardware reviews, and tech news.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", maxWidth: "400px", margin: "0 auto" }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1,
                padding: "12px 16px",
                background: "#0A0C10",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px",
                color: "#f5f5f5",
                fontSize: "14px"
              }}
            />
            <button style={{
              padding: "12px 24px",
              background: "#0FD980",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer"
            }}>
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;
