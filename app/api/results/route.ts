import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Result from '@/models/Result';

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const examId = url.searchParams.get('examId');
    const studentId = url.searchParams.get('studentId');
    
    let filter: any = {};
    if (examId) filter.examId = examId;
    if (studentId) filter.studentId = studentId;

    const results = await Result.find(filter)
      .populate('studentId', 'fullName admissionNumber class section fatherName')
      .populate('examId')
      .sort({ createdAt: 1 });
      
    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

function calculateLetterGrade(pct: number): string {
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 50) return 'D';
  return 'F';
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    if (Array.isArray(body)) {
      const operations = body.map(async (record) => {
        const { studentId, examId, subject, totalMarks, obtainedMarks, remarks } = record;

        // If it's a single subject result sheet from teacher/staff dashboard
        if (subject) {
          const resultDoc = await Result.findOne({ studentId, examId });
          const obtained = Number(obtainedMarks) || 0;
          const total = Number(totalMarks) || 100;
          const pct = total > 0 ? Math.round((obtained / total) * 100) : 0;
          const subGrade = calculateLetterGrade(pct);

          const subjectEntry = {
            name: subject,
            obtained,
            total,
            grade: subGrade
          };

          if (resultDoc) {
            // Ensure subjects array exists
            if (!resultDoc.subjects) resultDoc.subjects = [] as any;

            // Find existing subject entry
            const existingSubIdx = resultDoc.subjects.findIndex(
              (s: any) => s.name.toLowerCase() === subject.toLowerCase()
            );

            if (existingSubIdx > -1) {
              const subDoc = resultDoc.subjects[existingSubIdx] as any;
              if (subDoc) {
                subDoc.obtained = obtained;
                subDoc.total = total;
                subDoc.grade = subGrade;
              }
            } else {
              resultDoc.subjects.push(subjectEntry);
            }

            // Recalculate totals
            let sumObtained = 0;
            let sumTotal = 0;
            resultDoc.subjects.forEach((s: any) => {
              sumObtained += s.obtained || 0;
              sumTotal += s.total || 0;
            });

            resultDoc.marks = sumObtained;
            resultDoc.totalMarks = sumTotal;
            const overallPct = sumTotal > 0 ? Math.round((sumObtained / sumTotal) * 100) : 0;
            resultDoc.grade = calculateLetterGrade(overallPct);
            if (remarks) {
              resultDoc.remarks = remarks;
            }

            return resultDoc.save();
          } else {
            // Create new
            return Result.create({
              studentId,
              examId,
              subjects: [subjectEntry],
              marks: obtained,
              totalMarks: total,
              grade: subGrade,
              remarks: remarks || ''
            });
          }
        } else {
          // Standard complete result (from admin add-result.html)
          return Result.findOneAndUpdate(
            { studentId: record.studentId, examId: record.examId },
            record,
            { upsert: true, new: true }
          );
        }
      });
      const results = await Promise.all(operations);
      return NextResponse.json({ message: 'Results saved successfully', count: results.length }, { status: 201 });
    } else {
      const record = body;
      const { studentId, examId, subject, totalMarks, obtainedMarks, remarks } = record;

      if (subject) {
        const resultDoc = await Result.findOne({ studentId, examId });
        const obtained = Number(obtainedMarks) || 0;
        const total = Number(totalMarks) || 100;
        const pct = total > 0 ? Math.round((obtained / total) * 100) : 0;
        const subGrade = calculateLetterGrade(pct);

        const subjectEntry = {
          name: subject,
          obtained,
          total,
          grade: subGrade
        };

        if (resultDoc) {
          if (!resultDoc.subjects) resultDoc.subjects = [] as any;
          
          const existingSubIdx = resultDoc.subjects.findIndex(
            (s: any) => s.name.toLowerCase() === subject.toLowerCase()
          );

          if (existingSubIdx > -1) {
            const subDoc = resultDoc.subjects[existingSubIdx] as any;
            if (subDoc) {
              subDoc.obtained = obtained;
              subDoc.total = total;
              subDoc.grade = subGrade;
            }
          } else {
            resultDoc.subjects.push(subjectEntry);
          }

          let sumObtained = 0;
          let sumTotal = 0;
          resultDoc.subjects.forEach((s: any) => {
            sumObtained += s.obtained || 0;
            sumTotal += s.total || 0;
          });

          resultDoc.marks = sumObtained;
          resultDoc.totalMarks = sumTotal;
          const overallPct = sumTotal > 0 ? Math.round((sumObtained / sumTotal) * 100) : 0;
          resultDoc.grade = calculateLetterGrade(overallPct);
          if (remarks) {
            resultDoc.remarks = remarks;
          }

          const savedResult = await resultDoc.save();
          return NextResponse.json({ message: 'Result saved successfully', result: savedResult }, { status: 201 });
        } else {
          const newResult = await Result.create({
            studentId,
            examId,
            subjects: [subjectEntry],
            marks: obtained,
            totalMarks: total,
            grade: subGrade,
            remarks: remarks || ''
          });
          return NextResponse.json({ message: 'Result saved successfully', result: newResult }, { status: 201 });
        }
      } else {
        const result = await Result.findOneAndUpdate(
          { studentId: body.studentId, examId: body.examId },
          body,
          { upsert: true, new: true }
        );
        return NextResponse.json({ message: 'Result saved successfully', result }, { status: 201 });
      }
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
