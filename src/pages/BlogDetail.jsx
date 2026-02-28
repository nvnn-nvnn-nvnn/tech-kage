import React from "react";
import { useParams } from "react-router-dom";
import TechKageLanding from "../assets/TechKageLanding.png";

const blogPosts = [
  {
    id: 1,
    title: "Top 10 GPU Benchmarks for 2024: Which Card Reigns Supreme?",
    date: "February 15, 2024",
    excerpt: "Dive deep into the latest GPU benchmarks comparing NVIDIA RTX 40-series, AMD RX 7000-series, and Intel Arc GPUs across gaming, rendering, and AI workloads.",
    image: TechKageLanding,
    readTime: "8 min read",
    category: "Hardware Reviews",
    content: `
      <h2>Introduction</h2>
      <p>GPU benchmarking has become increasingly important as graphics cards power everything from gaming to AI workloads. In 2024, the landscape is more competitive than ever with NVIDIA's RTX 40-series, AMD's RX 7000-series, and Intel's Arc GPUs all vying for performance supremacy.</p>
      
      <h2>Methodology</h2>
      <p>Our benchmarks were conducted using the latest drivers and software versions across multiple test systems. We focused on real-world performance rather than synthetic benchmarks alone.</p>
      
      <h2>Key Findings</h2>
      <ul>
        <li>NVIDIA RTX 4090 leads in raw performance but at a premium price</li>
        <li>AMD RX 7800 XT offers excellent value for 1440p gaming</li>
        <li>Intel Arc GPUs show promise but need driver improvements</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Choose your GPU based on your specific use case and budget. The "best" GPU depends on what you're planning to do with it.</p>
    `
  }
];

function BlogDetail() {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === parseInt(id));

  if (!post) {
    return (
      <div style={{
        minHeight: "100vh",
        padding: "3rem 2.5rem",
        background: "#050608",
        color: "#f5f5f5",
        textAlign: "center"
      }}>
        <h1>Blog Post Not Found</h1>
        <p>The requested blog post could not be found.</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      padding: "3rem 2.5rem",
      background: "#050608",
      color: "#f5f5f5",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <img
          src={post.image}
          alt={post.title}
          style={{
            width: "100%",
            height: "300px",
            objectFit: "cover",
            borderRadius: "12px",
            marginBottom: "24px"
          }}
        />

        <div style={{
          background: "rgba(15,217,128,0.1)",
          color: "#0FD980",
          padding: "4px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: 600,
          display: "inline-block",
          marginBottom: "12px"
        }}>
          {post.category}
        </div>

        <h1 style={{
          fontSize: 48,
          marginBottom: 16,
          fontWeight: 800,
          letterSpacing: -1,
          fontFamily: "'Orbitron', sans-serif"
        }}>
          {post.title}
        </h1>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          paddingBottom: "16px",
          borderBottom: "1px solid rgba(255,255,255,0.1)"
        }}>
          <span style={{ fontSize: "14px", opacity: 0.6 }}>{post.date}</span>
          <span style={{ fontSize: "14px", opacity: 0.6 }}>{post.readTime}</span>
        </div>

        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
}

export default BlogDetail;
