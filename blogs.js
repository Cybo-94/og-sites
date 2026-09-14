/**
 * CYBO Blog Data
 * Edit this file to add, remove, or update blog posts.
 * 
 * Blog structure:
 * {
 *   id: "unique-id",
 *   title: "Blog title",
 *   date: "YYYY-MM-DD",
 *   category: "Category name",
 *   color: "#HEXCOLOR",
 *   content: ["Paragraph 1", "Paragraph 2", ...],
 *   youtube: "https://www.youtube.com/watch?v=VIDEO_ID",
 *   sources: [{ name: "Source name", link: "https://..." }]
 * }
 */
// Make blogs array globally available
window.blogs = window.blogs || [];

const blogs = [
  {
    id: "art-of-starting",
    title: "The Art of Starting Something New",
    date: "2026-09-14",
    category: "Thoughts",
    color: "#DFF4FF",
    content: [
      "Starting something new is uncomfortable because you are stepping into a situation where the result is unknown. You don't know whether the idea will work, whether people will care, or whether you are simply wasting your time.",
      "But waiting until everything is perfect creates a strange problem: you never actually begin.",
      "The first version of an idea is rarely the final version. You build something, notice what is wrong, learn from it, and improve it. That cycle is often more valuable than planning everything beforehand.",
      "Starting also teaches you something that research alone cannot. You discover what actually matters only after you begin doing the work.",
      "So the goal is not to start perfectly. The goal is to start honestly, learn quickly, and keep improving."
    ],
    youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    sources: [
      {
        name: "MDN Web Docs",
        link: "https://developer.mozilla.org/"
      },
      {
        name: "Example Reference",
        link: "https://example.com"
      }
    ]
  },
  {
    id: "why-curiosity-matters",
    title: "Why Curiosity Matters",
    date: "2026-09-10",
    category: "Ideas",
    color: "#FFF1D6",
    content: [
      "Curiosity is one of the simplest ways to learn because it turns information into a personal question.",
      "Instead of asking only what works, ask why it works. That small change can completely change the way you understand a subject.",
      "The internet gives us access to an absurd amount of information. The difficult part is not finding information anymore. The difficult part is deciding which information deserves your attention.",
      "A curious mind does not blindly accept an answer. It keeps asking better questions until the answer actually makes sense.",
      "That habit is useful everywhere: studying, building technology, creating content, solving problems, or simply understanding how the world around you works."
    ],
    youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    sources: [
      {
        name: "MDN Web Docs",
        link: "https://developer.mozilla.org/"
      }
    ]
  },
  {
    id: "small-ideas",
    title: "Small Ideas Can Become Big Things",
    date: "2026-09-05",
    category: "Creation",
    color: "#E8FFD9",
    content: [
      "Not every useful idea arrives as a revolutionary discovery. Sometimes it begins as a tiny observation that refuses to leave your mind.",
      "A small idea becomes interesting when you actually do something with it. Write it down. Test it. Build a rough version. Break it. Then try again.",
      "Ideas become valuable through execution.",
      "The world already has enough people waiting for the perfect moment. Creating something imperfect is usually more useful."
    ],
    youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    sources: [
      {
        name: "Example Reference",
        link: "https://example.com"
      }
    ]
  }
];
