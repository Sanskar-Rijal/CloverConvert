import os from "node:os";

export function getWorkerCount(): number {
  const cpuCores = os.cpus().length;
  const workerCount = Number(process.env.WORKER_COUNT || 0);

  //Checking whether workerCount is real number and is greater than 1;
  if (Number.isFinite(workerCount) && workerCount >= 1)
    return Math.min(workerCount, cpuCores - 1);

  //if no env file then
  return Math.max(1, cpuCores - 1);
}
