import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Input from "../components/Input";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Modal from "../components/Modal";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    projectId: null,
    projectName: "",
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data);
    } catch (err) {
      setError("Failed to load projects");
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post("/projects", formData);
      setProjects([response.data, ...projects]);
      setFormData({ name: "", description: "" });
      setShowForm(false);
      setError("");
      toast.success("Project created successfully!");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Failed to create project";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    if (!editFormData.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.put(
        `/projects/${editingProject._id}`,
        editFormData,
      );
      setProjects(
        projects.map((p) => (p._id === editingProject._id ? response.data : p)),
      );
      setEditingProject(null);
      setEditFormData({ name: "", description: "" });
      setError("");
      toast.success("Project updated successfully!");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to update project";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    const { projectId } = deleteModal;
    try {
      await api.delete(`/projects/${projectId}`);
      setProjects(projects.filter((p) => p._id !== projectId));
      toast.success("Project deleted successfully!");
      setDeleteModal({ isOpen: false, projectId: null, projectName: "" });
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to delete project";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const confirmDelete = (projectId, projectName) => {
    setDeleteModal({ isOpen: true, projectId, projectName });
  };

  const viewTasks = (projectId) => {
    navigate(`/tasks?projectId=${projectId}`);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const containerStyles = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  };

  const contentStyles = {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
  };

  const headerStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "2px solid #f0f0f0",
  };

  const projectCardStyles = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
    border: "1px solid #eef2f6",
  };

  const projectInfoStyles = {
    flex: 1,
  };

  const buttonGroupStyles = {
    display: "flex",
    gap: "10px",
  };

  const formContainerStyles = {
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
    border: "1px solid #eef2f6",
  };

  const statsCardStyles = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  };

  const statItemStyles = {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid #eef2f6",
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={containerStyles}>
      <div style={contentStyles}>
        <div style={headerStyles}>
          <div>
            <h1 style={{ color: "#333", marginBottom: "8px" }}>Dashboard</h1>
            <p style={{ color: "#666" }}>Welcome back, {user?.name}! 👋</p>
          </div>
          <Button onClick={handleLogout} variant="secondary">
            Logout
          </Button>
        </div>

        <ErrorMessage message={error} onClose={() => setError("")} />

        {/* Stats Section */}
        <div style={statsCardStyles}>
          <div style={statItemStyles}>
            <h3
              style={{
                fontSize: "32px",
                color: "#667eea",
                marginBottom: "8px",
              }}
            >
              {projects.length}
            </h3>
            <p style={{ color: "#666" }}>Total Projects</p>
          </div>
          <div style={statItemStyles}>
            <h3
              style={{
                fontSize: "32px",
                color: "#28a745",
                marginBottom: "8px",
              }}
            >
              {projects.filter((p) => p.createdAt).length}
            </h3>
            <p style={{ color: "#666" }}>Active Projects</p>
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Create New Project"}
          </Button>
        </div>

        {showForm && (
          <div style={formContainerStyles}>
            <h3 style={{ marginBottom: "20px", color: "#333" }}>
              Create New Project
            </h3>
            <form onSubmit={handleCreateProject}>
              <Input
                label="Project Name"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter project name"
                required
              />
              <Input
                label="Description (Optional)"
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter project description"
              />
              <Button type="submit" loading={submitting}>
                Create Project
              </Button>
            </form>
          </div>
        )}

        {editingProject && (
          <div style={formContainerStyles}>
            <h3 style={{ marginBottom: "20px", color: "#333" }}>
              Edit Project: {editingProject.name}
            </h3>
            <form onSubmit={handleUpdateProject}>
              <Input
                label="Project Name"
                name="name"
                value={editFormData.name}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, name: e.target.value })
                }
                placeholder="Enter project name"
                required
              />
              <Input
                label="Description (Optional)"
                name="description"
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    description: e.target.value,
                  })
                }
                placeholder="Enter project description"
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <Button type="submit" loading={submitting}>
                  Update Project
                </Button>
                <Button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  variant="secondary"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <h2 style={{ marginBottom: "20px", color: "#333" }}>Your Projects</h2>
        {projects.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              backgroundColor: "#f8f9fa",
              borderRadius: "12px",
            }}
          >
            <p style={{ color: "#666", marginBottom: "16px" }}>
              No projects yet. Create your first project!
            </p>
            <Button onClick={() => setShowForm(true)}>Create Project</Button>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              style={projectCardStyles}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
              }}
            >
              <div style={projectInfoStyles}>
                <h3 style={{ color: "#333", marginBottom: "8px" }}>
                  {project.name}
                </h3>
                {project.description && (
                  <p style={{ color: "#666", marginBottom: "8px" }}>
                    {project.description}
                  </p>
                )}
                <small style={{ color: "#999" }}>
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </small>
              </div>
              <div style={buttonGroupStyles}>
                <Button
                  onClick={() => viewTasks(project._id)}
                  variant="primary"
                >
                  View Tasks
                </Button>
                <Button
                  onClick={() => {
                    setEditingProject(project);
                    setEditFormData({
                      name: project.name,
                      description: project.description || "",
                    });
                  }}
                  variant="secondary"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => confirmDelete(project._id, project.name)}
                  variant="danger"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, projectId: null, projectName: "" })
        }
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteModal.projectName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Dashboard;
