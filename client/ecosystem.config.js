module.exports = {
  apps: [
    {
      name: "MediBook",
      script: "npm",
      args: "start",
      cwd: "/root/MediBook/client",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};