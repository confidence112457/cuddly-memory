import { motion } from "framer-motion";

export default function Footer() {
  const footerSections = [
    {
      title: "Menu",
      links: [
        { label: "About us", href: "#" },
        { label: "Investments", href: "#" },
        { label: "FAQ", href: "#" },
        { label: "Contacts", href: "#" },
      ],
    },
    {
      title: "Actions",
      links: [
        { label: "Make a Deposit", href: "#" },
        { label: "Statistics", href: "#" },
        { label: "Login", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
      ],
    },
  ];

  const languages = ["English", "Español", "Français"];

  return (
    <footer className="bg-card py-12 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          className="grid md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-green-500 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Language</h3>
            <select className="bg-muted border border-border rounded px-3 py-2 text-foreground">
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </motion.div>
        </motion.div>

        <motion.div
          className="border-t border-border mt-8 pt-8 text-center text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p>&copy; Copyright 2025 Genius Trading Platform. All Rights Reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}
