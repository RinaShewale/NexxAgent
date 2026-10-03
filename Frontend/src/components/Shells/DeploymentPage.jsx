import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, CheckCircle2, LoaderCircle, Rocket } from "lucide-react";
import { deployProject } from "../../api/deployment";
import { getProjects } from "../../api/sandbox";
import useSandboxStore from "../../store/sandboxStore";

const POLL_INTERVAL_MS = 3000;

export default function DeploymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const storedProjectId = useSandboxStore((state) => state.projectId);
  const projectId = location.state?.projectId || storedProjectId;
  const [status, setStatus] = useState("checking");
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let isActive = true;
    let pollTimeout;

    const loadProject = async () => {
      const response = await getProjects();
      const project = response.projects?.find(
        (item) => String(item.id || item._id) === String(projectId)
      );

      if (!project) {
        throw new Error("The project could not be found. Return to the editor and try again.");
      }

      return project;
    };

    const redirectIfDeployed = (project) => {
      if (project.deploymentStatus !== "deployed") return false;

      navigate("/history", { replace: true });
      return true;
    };

    const pollDeployment = async () => {
      try {
        const project = await loadProject();
        if (!isActive || redirectIfDeployed(project)) return;

        if (project.deploymentStatus === "failed") {
          throw new Error("Deployment failed. Retry to start a new deployment.");
        }

        setStatus("building");
        pollTimeout = window.setTimeout(pollDeployment, POLL_INTERVAL_MS);
      } catch (deploymentError) {
        if (!isActive) return;
        setError(deploymentError.message || "Unable to check deployment status.");
        setStatus("failed");
      }
    };

    const startDeployment = async () => {
      if (!projectId) {
        setError("No project was selected. Return to the editor and try again.");
        setStatus("failed");
        return;
      }

      setError("");
      setStatus("checking");

      try {
        const project = await loadProject();
        if (!isActive || redirectIfDeployed(project)) return;

        if (project.deploymentStatus !== "building") {
          setStatus("starting");
          try {
            await deployProject(projectId);
          } catch (deploymentError) {
            // A conflict means another request already started this deployment.
            if (deploymentError.status !== 409) throw deploymentError;
          }
        }

        if (!isActive) return;
        setStatus("building");
        pollTimeout = window.setTimeout(pollDeployment, POLL_INTERVAL_MS);
      } catch (deploymentError) {
        if (!isActive) return;
        setError(deploymentError.message || "Unable to start deployment.");
        setStatus("failed");
      }
    };

    startDeployment();

    return () => {
      isActive = false;
      window.clearTimeout(pollTimeout);
    };
  }, [navigate, projectId, retry]);

  const isWorking = status !== "failed";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FDF3E4] px-5 py-12 text-[#34170A]">
      <section className="w-full max-w-xl rounded-[2rem] border border-[#A35100]/15 bg-white/80 p-8 text-center shadow-[0_24px_80px_-32px_rgba(52,23,10,0.35)] sm:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#A35100]/10 text-[#A35100]">
          {isWorking ? (
            status === "checking" ? (
              <LoaderCircle size={30} className="animate-spin" />
            ) : (
              <Rocket size={30} />
            )
          ) : (
            <AlertCircle size={30} />
          )}
        </div>

        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#A35100]">
          {status === "failed" ? "Deployment interrupted" : "Production deployment"}
        </p>
        <h1 className="font-serif text-3xl italic sm:text-4xl">
          {status === "checking" && "Preparing your deployment"}
          {status === "starting" && "Starting your deployment"}
          {status === "building" && "Building your vision"}
          {status === "failed" && "We couldn't complete deployment"}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#34170A]/65">
          {status === "failed"
            ? error
            : "Your app is being built and published. This page will take you to deployment history when it is live."}
        </p>

        {isWorking && (
          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A35100]">
            {status === "building" ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : (
              <CheckCircle2 size={15} />
            )}
            {status === "building" ? "Deployment in progress" : "Checking project status"}
          </div>
        )}

        {status === "failed" && (
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={() => setRetry((value) => value + 1)}
              className="rounded-xl bg-[#34170A] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#A35100]"
            >
              Retry deployment
            </button>
            <button
              onClick={() => navigate("/shell")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#A35100]/20 px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#A35100] transition-colors hover:bg-[#A35100]/5"
            >
              <ArrowLeft size={14} />
              Back to editor
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
