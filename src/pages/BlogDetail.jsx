import React from "react";
import { useParams } from "react-router-dom";
import TechKageLanding from "../assets/TechKageLanding.png";

const blogPosts = [
  {
    id: 1,
    title: "Introduction to TechKage!",
    date: "February 28, 2024",
    excerpt: "TechKage is your ultimate destination for custom PC building, hardware reviews, and technology insights.",
    image: TechKageLanding,
    readTime: "5 min read",
    category: "Technology",
    content: `
      <h2>Welcome to TechKage</h2>
      <p>TechKage is your ultimate destination for custom PC building, hardware reviews, and technology insights. Whether you're a gamer, content creator, or enthusiast, we provide the tools and knowledge to build the perfect PC tailored to your needs.</p>
      
      <h2>Our Mission</h2>
      <p>At TechKage, we believe that building a PC should be accessible and enjoyable for everyone. Our platform offers comprehensive tools and resources to help you every step of the way:</p>
      <ul>
        <li><strong>Interactive PC Builder:</strong> Our easy-to-use builder ensures compatibility and optimizes performance for your specific use case.</li>
        <li><strong>Hardware Reviews & Benchmarks:</strong> In-depth reviews of the latest components with real-world testing and performance data.</li>
        <li><strong>Expert Guides & Tutorials:</strong> Step-by-step guides for beginners and advanced users alike.</li>
        <li><strong>Community Insights:</strong> Connect with fellow PC enthusiasts and share your builds.</li>
      </ul>
      
      <h2>Why Choose TechKage?</h2>
      <p>With years of experience in the PC building community, TechKage stands out for its commitment to quality, accuracy, and user experience. Our team of experts tests every component and provides unbiased recommendations based on real data.</p>
      
      <h2>Get Started Today</h2>
      <p>Ready to build your dream PC? Start with our PC builder tool and explore our extensive blog for the latest tech news, reviews, and tips. Join the TechKage community and elevate your PC building experience.</p>
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
