export const styles = {
  page: {
    minHeight: "100vh",
    padding: "48px 40px 64px",
  },

  container: {
    maxWidth: 800,
    margin: "0 auto",
  },

  kicker: {
    fontFamily: "'Courier New', monospace",
    color: "#2EE6A8",
    fontSize: 14,
    letterSpacing: 1,
    marginBottom: 16,
  },

  title: {
    fontSize: 44,
    fontWeight: 700,
    margin: "0 0 12px",
    lineHeight: 1.1,
    color: "#F4F0E8",
  },

  description: {
    fontSize: 18,
    color: "#97A1B3",
    lineHeight: 1.6,
    margin: "0 0 32px",
    letterSpacing: 0.1,
  },

  card: {
    padding: 32,
    backgroundColor: "rgba(28, 34, 44, 0.92)",
    border: "1px solid rgba(226, 183, 109, 0.2)",
    borderRadius: 20,
    boxShadow: "0 24px 70px rgba(0, 0, 0, 0.24)",
  },

  loginPrompt: {
    textAlign: "center",
    padding: 48,
  },

  loginMessage: {
    color: "#E8EDF2",
    fontSize: 18,
    lineHeight: 1.6,
    marginBottom: 24,
  },

  loginButton: {
    display: "inline-block",
    padding: "12px 24px",
    color: "#14181F",
    background: "#2EE6A8",
    border: 0,
    borderRadius: 8,
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
  },

  field: {
    marginBottom: 24,
  },

  label: {
    display: "block",
    color: "#F4F0E8",
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 8,
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    background: "#14181F",
    color: "#F4F0E8",
    border: "1px solid rgba(226, 183, 109, 0.25)",
    borderRadius: 8,
    fontSize: 16,
    outline: "none",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: 150,
    padding: "13px 14px",
    background: "#14181F",
    color: "#F4F0E8",
    border: "1px solid rgba(226, 183, 109, 0.25)",
    borderRadius: 8,
    fontSize: 16,
    lineHeight: 1.6,
    resize: "vertical",
    outline: "none",
  },

  select: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    background: "#14181F",
    color: "#F4F0E8",
    border: "1px solid rgba(226, 183, 109, 0.25)",
    borderRadius: 8,
    fontSize: 16,
    outline: "none",
  },

  help: {
    display: "block",
    color: "#97A1B3",
    fontSize: 13,
    marginTop: 7,
  },

  error: {
    color: "#FF8A8A",
    fontSize: 14,
    marginTop: 7,
  },

  message: {
    padding: "12px 14px",
    marginBottom: 24,
    background: "rgba(255, 138, 138, 0.08)",
    border: "1px solid rgba(255, 138, 138, 0.25)",
    borderRadius: 8,
    color: "#FFB3B3",
    lineHeight: 1.5,
  },

  sectionTitle: {
    color: "#2EE6A8",
    fontSize: 17,
    fontWeight: 700,
    margin: "8px 0 20px",
    paddingBottom: 10,
    borderBottom: "1px solid rgba(226, 183, 109, 0.2)",
  },

  submitButton: {
    width: "100%",
    padding: "14px 20px",
    color: "#14181F",
    background: "#2EE6A8",
    border: 0,
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
  },

  submitButtonDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
};
