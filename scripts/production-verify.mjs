/**
 * Production API verification — run against local or deployed base URL.
 * Usage: node scripts/production-verify.mjs [baseUrl]
 * Example: node scripts/production-verify.mjs https://qurtaba-academy-of-excellence-bela.vercel.app
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const BASE = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');

const results = { pass: 0, fail: 0, tests: [] };

function record(name, ok, detail = '') {
  results.tests.push({ name, ok, detail });
  if (ok) results.pass++;
  else results.fail++;
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`);
}

async function req(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { status: res.status, data };
}

async function main() {
  console.log(`\nVerifying: ${BASE}\n`);

  const health = await req('GET', '/api/health');
  record('Health / Atlas', health.status === 200 && health.data?.ok === true, health.data?.message || String(health.status));

  const stats = await req('GET', '/api/stats');
  record('Stats (dynamic counts)', stats.status === 200 && typeof stats.data?.totalStudents === 'number');

  const students = await req('GET', '/api/students');
  record('Students fetch', students.status === 200);

  const classes = await req('GET', '/api/classes');
  record('Classes fetch', classes.status === 200);

  const staff = await req('GET', '/api/staff');
  record('Staff fetch', staff.status === 200);

  const fees = await req('GET', '/api/fees');
  record('Fees fetch', fees.status === 200);

  const programs = await req('GET', '/api/programs');
  record('Programs fetch', programs.status === 200);

  const notifications = await req('GET', '/api/notifications');
  record('Notifications fetch', notifications.status === 200);

  const admissions = await req('GET', '/api/admissions');
  record('Admissions fetch', admissions.status === 200);

  const verify = await req('GET', '/api/verify?admissionNumber=TEST');
  record('Verification API', verify.status === 200 || verify.status === 404);

  const login = await req('POST', '/api/auth/login', {
    email: 'admin@qurtaba.edu.pk',
    password: 'admin123',
  });
  const token = login.data?.token;
  record('Super Admin login', login.status === 200 && !!token, login.data?.message);

  const pages = [
    { path: '/', ok: (s) => s === 200 || s === 307 || s === 308 },
    { path: '/index.html', ok: (s) => s === 200 },
    { path: '/programs.html', ok: (s) => s === 200 },
    { path: '/gallery.html', ok: (s) => s === 200 },
    { path: '/verification.html', ok: (s) => s === 200 },
    { path: '/contact.html', ok: (s) => s === 200 },
  ];
  for (const { path: p, ok } of pages) {
    try {
      const r = await fetch(`${BASE}${p}`, { redirect: 'follow' });
      record(`Public page ${p}`, ok(r.status), String(r.status));
    } catch (e) {
      record(`Public page ${p}`, false, e.message);
    }
  }

  console.log(`\n--- Summary: ${results.pass} passed, ${results.fail} failed ---\n`);
  process.exit(results.fail > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
