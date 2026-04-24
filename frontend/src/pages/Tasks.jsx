import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import Input from "../components/Input";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Modal from "../components/Modal";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Todo",
    projectId: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    status: "Todo",
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    taskId: null,
    taskTitle: "",
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const projectId = searchParams.get("projectId");

  // Responsive state
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        api.get(`/tasks${projectId ? `?projectId=${projectId}` : ""}`),
        api.get("/projects"),
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);

      if (projectId) {
        const project = projectsRes.data.find((p) => p._id === projectId);
        if (project) {
          setFormData((prev) => ({ ...prev, projectId }));
        }
      }
    } catch (err) {
      setError("Failed to load data");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Task title is required");
      return;
    }
    if (!formData.projectId) {
      toast.error("Please select a project");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post("/tasks", {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        projectId: formData.projectId,
      });
      setTasks([response.data, ...tasks]);
      setFormData({
        title: "",
        description: "",
        status: "Todo",
        projectId: formData.projectId,
      });
      setShowForm(false);
      setError("");
      toast.success("Task created successfully!");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to create task";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!editFormData.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    setSubmitting(true);
    try {
      await api.put(`/tasks/${editingTask._id}`, {
        status: editFormData.status,
      });
      const updatedTask = {
        ...editingTask,
        title: editFormData.title,
        description: editFormData.description,
        status: editFormData.status,
      };
      setTasks(
        tasks.map((task) =>
          task._id === editingTask._id ? updatedTask : task,
        ),
      );
      setEditingTask(null);
      setEditFormData({ title: "", description: "", status: "Todo" });
      setError("");
      toast.success("Task updated successfully!");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update task";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(
        tasks.map((task) => (task._id === taskId ? response.data : task)),
      );
      toast.success(`Task status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update task status");
    }
  };

  const handleDeleteTask = async () => {
    const { taskId } = deleteModal;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
      toast.success("Task deleted successfully!");
      setDeleteModal({ isOpen: false, taskId: null, taskTitle: "" });
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const confirmDelete = (taskId, taskTitle) => {
    setDeleteModal({ isOpen: true, taskId, taskTitle });
  };

  const getStatusColor = (status) => {
    const colors = {
      Todo: "#ffc107",
      "In Progress": "#17a2b8",
      Done: "#28a745",
    };
    return colors[status] || "#6c757d";
  };

  const getStatusCount = () => {
    const counts = {
      Todo: tasks.filter((t) => t.status === "Todo").length,
      "In Progress": tasks.filter((t) => t.status === "In Progress").length,
      Done: tasks.filter((t) => t.status === "Done").length,
    };
    return counts;
  };

  // Responsive styles
  const containerStyles = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: isMobile ? "15px" : "20px",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  };

  const contentStyles = {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: isMobile ? "20px" : "30px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
  };

  const headerStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "2px solid #f0f0f0",
    flexDirection: isMobile ? "column" : "row",
    alignItems: isMobile ? "flex-start" : "center",
    gap: isMobile ? "15px" : "0",
  };

  const statsContainerStyles = {
    display: "grid",
    gridTemplateColumns: isMobile
      ? "1fr"
      : "repeat(auto-fit, minmax(150px, 1fr))",
    gap: isMobile ? "15px" : "20px",
    marginBottom: "30px",
  };

  const statCardStyles = {
    textAlign: "center",
    padding: isMobile ? "16px" : "20px",
    borderRadius: "12px",
    backgroundColor: "#f8f9fa",
    border: "1px solid #eef2f6",
  };

  const taskCardStyles = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: isMobile ? "16px" : "20px",
    marginBottom: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    transition: "transform 0.2s, box-shadow 0.2s",
    border: "1px solid #eef2f6",
  };

  const taskHeaderStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "10px",
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? "15px" : "0",
  };

  const taskButtonsStyles = {
    display: "flex",
    gap: "10px",
    flexDirection: isMobile ? "column" : "row",
    width: isMobile ? "100%" : "auto",
  };

  const taskContentStyles = {
    flex: 1,
    width: isMobile ? "100%" : "auto",
  };

  const statusSectionStyles = {
    marginTop: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? "15px" : "0",
    alignItems: isMobile ? "flex-start" : "center",
  };

  const quickStatusStyles = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
    width: isMobile ? "100%" : "auto",
    justifyContent: isMobile ? "space-between" : "flex-start",
  };

  const statusBadgeStyles = (status) => ({
    display: "inline-block",
    padding: isMobile ? "6px 16px" : "4px 12px",
    borderRadius: "20px",
    backgroundColor: getStatusColor(status),
    color: "white",
    fontSize: isMobile ? "13px" : "12px",
    fontWeight: "500",
  });

  const selectStyles = {
    padding: isMobile ? "10px 12px" : "8px 12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginLeft: isMobile ? "0" : "10px",
    cursor: "pointer",
    backgroundColor: "white",
    width: isMobile ? "auto" : "auto",
  };

  const formContainerStyles = {
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    padding: isMobile ? "16px" : "24px",
    marginBottom: "24px",
    border: "1px solid #eef2f6",
  };

  const backButtonStyles = {
    background: "none",
    border: "none",
    fontSize: isMobile ? "14px" : "16px",
    cursor: "pointer",
    color: "#667eea",
    padding: isMobile ? "6px 12px" : "8px 16px",
    borderRadius: "8px",
    transition: "background 0.2s",
    width: isMobile ? "100%" : "auto",
  };

  const emptyStateStyles = {
    textAlign: "center",
    padding: isMobile ? "40px 15px" : "60px 20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
  };

  const statNumberStyles = {
    fontSize: isMobile ? "28px" : "32px",
    marginBottom: "8px",
  };

  const statusCounts = getStatusCount();

  if (loading) return <LoadingSpinner />;

  return (
    <div style={containerStyles}>
      <div style={contentStyles}>
        <div style={headerStyles}>
          <div style={{ width: isMobile ? "100%" : "auto" }}>
            <button
              onClick={() => navigate("/dashboard")}
              style={backButtonStyles}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f0f0f0")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              ← Back to Dashboard
            </button>
            <h1
              style={{
                color: "#333",
                marginTop: isMobile ? "12px" : "16px",
                marginBottom: "8px",
                fontSize: isMobile ? "24px" : "32px",
              }}
            >
              Tasks
            </h1>
            {projectId && (
              <p
                style={{ color: "#666", fontSize: isMobile ? "14px" : "16px" }}
              >
                Project: {projects.find((p) => p._id === projectId)?.name}
              </p>
            )}
          </div>
        </div>

        <ErrorMessage message={error} onClose={() => setError("")} />

        {/* Status Statistics */}
        <div style={statsContainerStyles}>
          <div style={statCardStyles}>
            <h3 style={{ ...statNumberStyles, color: "#ffc107" }}>
              {statusCounts.Todo}
            </h3>
            <p style={{ color: "#666" }}>Todo</p>
          </div>
          <div style={statCardStyles}>
            <h3 style={{ ...statNumberStyles, color: "#17a2b8" }}>
              {statusCounts["In Progress"]}
            </h3>
            <p style={{ color: "#666" }}>In Progress</p>
          </div>
          <div style={statCardStyles}>
            <h3 style={{ ...statNumberStyles, color: "#28a745" }}>
              {statusCounts.Done}
            </h3>
            <p style={{ color: "#666" }}>Done</p>
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <Button
            onClick={() => setShowForm(!showForm)}
            style={isMobile ? { width: "100%" } : {}}
          >
            {showForm ? "Cancel" : "+ Create New Task"}
          </Button>
        </div>

        {showForm && (
          <div style={formContainerStyles}>
            <h3
              style={{
                marginBottom: "20px",
                color: "#333",
                fontSize: isMobile ? "20px" : "24px",
              }}
            >
              Create New Task
            </h3>
            <form onSubmit={handleCreateTask}>
              <Input
                label="Task Title"
                name="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter task title"
                required
              />
              <Input
                label="Description (Optional)"
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter task description"
              />

              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Project *
                </label>
                <select
                  value={formData.projectId}
                  onChange={(e) =>
                    setFormData({ ...formData, projectId: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: isMobile ? "12px" : "10px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    fontSize: isMobile ? "16px" : "14px",
                  }}
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: isMobile ? "12px" : "10px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    fontSize: isMobile ? "16px" : "14px",
                  }}
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <Button
                type="submit"
                loading={submitting}
                style={isMobile ? { width: "100%" } : {}}
              >
                Create Task
              </Button>
            </form>
          </div>
        )}

        {editingTask && (
          <div style={formContainerStyles}>
            <h3
              style={{
                marginBottom: "20px",
                color: "#333",
                fontSize: isMobile ? "20px" : "24px",
              }}
            >
              Edit Task
            </h3>
            <form onSubmit={handleUpdateTask}>
              <Input
                label="Task Title"
                name="title"
                value={editFormData.title}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, title: e.target.value })
                }
                placeholder="Enter task title"
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
                placeholder="Enter task description"
              />

              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Status
                </label>
                <select
                  value={editFormData.status}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, status: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: isMobile ? "12px" : "10px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    fontSize: isMobile ? "16px" : "14px",
                  }}
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <Button
                  type="submit"
                  loading={submitting}
                  style={isMobile ? { width: "100%" } : {}}
                >
                  Update Task
                </Button>
                <Button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  variant="secondary"
                  style={isMobile ? { width: "100%" } : {}}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <h2
          style={{
            marginBottom: "20px",
            color: "#333",
            fontSize: isMobile ? "20px" : "28px",
          }}
        >
          All Tasks
        </h2>

        {tasks.length === 0 ? (
          <div style={emptyStateStyles}>
            <p style={{ color: "#666", marginBottom: "16px" }}>
              No tasks yet. Create your first task!
            </p>
            <Button
              onClick={() => setShowForm(true)}
              style={isMobile ? { width: "100%" } : {}}
            >
              Create Task
            </Button>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              style={taskCardStyles}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
              }}
            >
              <div style={taskHeaderStyles}>
                <div style={taskContentStyles}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "10px",
                      marginBottom: "8px",
                      flexDirection: isMobile ? "row" : "column",
                    }}
                  >
                    <h3
                      style={{
                        color: "#333",
                        marginBottom: isMobile ? "0" : "8px",
                        fontSize: isMobile ? "18px" : "22px",
                        flex: isMobile ? 1 : "none",
                      }}
                    >
                      {task.title}
                    </h3>
                    {isMobile && (
                      <div>
                        <span style={statusBadgeStyles(task.status)}>
                          {task.status}
                        </span>
                      </div>
                    )}
                  </div>

                  {!isMobile && (
                    <div style={{ marginBottom: "8px" }}>
                      <span style={statusBadgeStyles(task.status)}>
                        {task.status}
                      </span>
                    </div>
                  )}

                  {task.description && (
                    <p
                      style={{
                        color: "#666",
                        marginBottom: "8px",
                        fontSize: isMobile ? "14px" : "16px",
                      }}
                    >
                      {task.description}
                    </p>
                  )}
                  <small
                    style={{
                      color: "#999",
                      fontSize: isMobile ? "11px" : "12px",
                    }}
                  >
                    Project: {task.project?.name}
                  </small>
                  <br />
                  <small
                    style={{
                      color: "#999",
                      fontSize: isMobile ? "11px" : "12px",
                    }}
                  >
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <div style={taskButtonsStyles}>
                  <Button
                    onClick={() => {
                      setEditingTask(task);
                      setEditFormData({
                        title: task.title,
                        description: task.description || "",
                        status: task.status,
                      });
                    }}
                    variant="secondary"
                    style={isMobile ? { width: "100%", padding: "12px" } : {}}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => confirmDelete(task._id, task.title)}
                    variant="danger"
                    style={isMobile ? { width: "100%", padding: "12px" } : {}}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <div style={statusSectionStyles}>
                <div>
                  <span></span>
                </div>
                <div style={quickStatusStyles}>
                  <label
                    style={{
                      marginRight: isMobile ? "0" : "10px",
                      fontSize: isMobile ? "14px" : "14px",
                      color: "#666",
                    }}
                  >
                    Quick Status:
                  </label>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleUpdateStatus(task._id, e.target.value)
                    }
                    style={selectStyles}
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, taskId: null, taskTitle: "" })
        }
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteModal.taskTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Tasks;
