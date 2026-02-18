import { spawn, ChildProcess } from 'child_process';

let tunnelUrl: string | null = null;
let tunnelProcess: ChildProcess | null = null;

/**
 * Starts a Cloudflare quick-tunnel that exposes localhost to the internet.
 * Returns the public https URL assigned by Cloudflare.
 */
export const startTunnel = (port: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (tunnelUrl) {
      resolve(tunnelUrl);
      return;
    }

    console.log('[Tunnel] Starting Cloudflare tunnel...');

    const isWindows = process.platform === 'win32';

    let proc: ChildProcess;
    try {
      if (isWindows) {
        proc = spawn('cmd.exe', ['/c', 'npx', '--yes', 'cloudflared', 'tunnel', '--url', `http://localhost:${port}`], {
          stdio: ['ignore', 'pipe', 'pipe'],
          windowsHide: true,
        });
      } else {
        proc = spawn('npx', ['--yes', 'cloudflared', 'tunnel', '--url', `http://localhost:${port}`], {
          stdio: ['ignore', 'pipe', 'pipe'],
          shell: true,
        });
      }
    } catch (err) {
      reject(err);
      return;
    }

    tunnelProcess = proc;
    let resolved = false;

    const onData = (data: Buffer) => {
      const output = data.toString();
      // Cloudflared prints the tunnel URL on stderr
      const match = output.match(/https:\/\/[^\s]+\.trycloudflare\.com/);
      if (match && !resolved) {
        resolved = true;
        tunnelUrl = match[0];
        resolve(tunnelUrl);
      }
    };

    proc.stdout?.on('data', onData);
    proc.stderr?.on('data', onData);

    proc.on('error', (err) => {
      if (!resolved) {
        resolved = true;
        reject(err);
      }
    });

    proc.on('exit', (code) => {
      if (!resolved) {
        resolved = true;
        reject(new Error(`Tunnel process exited with code ${code}`));
      }
      tunnelUrl = null;
      tunnelProcess = null;
    });

    // Timeout after 30 seconds
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        reject(new Error('Tunnel startup timed out after 30s'));
      }
    }, 30000);

    // Cleanup timeout if resolved
    const origResolve = resolve;
    const origReject = reject;
    resolve = (val) => { clearTimeout(timeout); origResolve(val); };
    reject = (err) => { clearTimeout(timeout); origReject(err); };
  });
};

/** Returns the active tunnel URL, or null if no tunnel is running. */
export const getTunnelUrl = (): string | null => tunnelUrl;

/** Terminates the tunnel process. */
export const stopTunnel = (): void => {
  if (tunnelProcess) {
    tunnelProcess.kill();
    tunnelProcess = null;
    tunnelUrl = null;
    console.log('[Tunnel] Stopped');
  }
};
