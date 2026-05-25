export interface AdmissionPayload {
  fullName: string;
  fatherName?: string;
  motherName?: string;
  cnic?: string;
  dob?: Date | string;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
  previousSchool?: string;
  appliedProgram?: string;
  appliedClass?: string;
  image?: string | null;
  documents?: string[];
  status?: string;
}

export function normalizeAdmissionBody(body: Record<string, unknown>): {
  data: AdmissionPayload;
  error?: string;
} {
  const fullName = String(body.fullName || '').trim();
  if (!fullName) {
    return { data: { fullName: '' }, error: 'Full name is required' };
  }

  const appliedClass = String(body.appliedClass || '').trim();
  const appliedProgram = String(body.appliedProgram || '').trim();
  if (!appliedClass) {
    return { data: { fullName }, error: 'Class is required' };
  }
  if (!appliedProgram) {
    return { data: { fullName }, error: 'Program is required' };
  }

  const phone = String(body.phone || '').trim();
  if (!phone) {
    return { data: { fullName }, error: 'Contact number is required' };
  }

  const fatherName = String(body.fatherName || '').trim();
  if (!fatherName) {
    return { data: { fullName }, error: 'Father/Guardian name is required' };
  }

  const address = String(body.address || '').trim();
  if (!address) {
    return { data: { fullName }, error: 'Address is required' };
  }

  let dob: Date | undefined;
  if (body.dob) {
    const parsed = new Date(String(body.dob));
    if (!Number.isNaN(parsed.getTime())) dob = parsed;
  }

  const rawDocs = body.documents;
  let documents: string[] = [];
  if (Array.isArray(rawDocs)) {
    documents = rawDocs.filter((d) => typeof d === 'string' && d.length > 0) as string[];
  }

  const image =
    typeof body.image === 'string' && body.image.trim() ? body.image.trim() : undefined;

  return {
    data: {
      fullName,
      fatherName,
      motherName: String(body.motherName || '').trim() || undefined,
      cnic: String(body.cnic || '').trim() || undefined,
      dob,
      gender: String(body.gender || '').trim() || undefined,
      address,
      phone,
      email: String(body.email || '').trim() || undefined,
      previousSchool: String(body.previousSchool || '').trim() || undefined,
      appliedProgram,
      appliedClass,
      image,
      documents,
      status: 'Pending',
    },
  };
}

export function generateAdmissionNumber(): string {
  return `ADM-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}
