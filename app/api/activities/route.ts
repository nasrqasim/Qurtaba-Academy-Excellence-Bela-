import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Activity from '@/models/Activity';

const SAMPLE_ACTIVITIES = [
  {
    title: 'Red House Champions',
    description: 'The Red House (Al-Biruni) displayed exceptional leadership and teamwork to secure the overall sports cup this semester.',
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800',
    category: 'School Houses',
  },
  {
    title: 'Blue House Athletics',
    description: 'The Blue House (Ibn-Sina) dominated the track and field events with high sportsmanship and remarkable achievements.',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800',
    category: 'School Houses',
  },
  {
    title: 'Bela Cricket Championship',
    description: 'Our senior cricket team emerged victorious in the Inter-District tournament, winning by a stunning margin of 45 runs.',
    image: 'https://images.unsplash.com/photo-1531415080290-bc98545ab3ef?auto=format&fit=crop&q=80&w=800',
    category: 'Sports',
  },
  {
    title: 'Annual Football League',
    description: 'A thrilling penalty shootout concluded the annual school league, with standard-setting goals throughout.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
    category: 'Sports',
  },
  {
    title: 'Grand Science & Tech Exhibition',
    description: 'Students showcased highly innovative robotics and sustainable energy projects at the district exhibition.',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
    category: 'Events',
  },
  {
    title: 'Annual Prize Distribution 2026',
    description: 'Acknowledging the exceptional academic, athletic, and extra-curricular achievements of our top performers.',
    image: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80&w=800',
    category: 'Events',
  },
  {
    title: 'Bela Bilingual Debate Championship',
    description: 'Our debate team won the gold trophy discussing sustainable development and societal responsibility.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
    category: 'Extra Curricular Activities',
  },
  {
    title: 'Annual Arts & Craft Festival',
    description: 'A beautiful exhibition of paintings, sketches, and handicrafts created by our talented young artists.',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800',
    category: 'Extra Curricular Activities',
  },
];

export async function GET() {
  try {
    await connectDB();
    let activities = await Activity.find().sort({ createdAt: -1 });
    
    // Auto-seed if empty
    if (activities.length === 0) {
      await Activity.insertMany(SAMPLE_ACTIVITIES);
      activities = await Activity.find().sort({ createdAt: -1 });
      console.log('✅ Seeded 8 initial sample activities in MongoDB.');
    }
    
    return NextResponse.json(activities, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    if (!data.title || !data.category) {
      return NextResponse.json({ message: 'Title and category are required' }, { status: 400 });
    }
    const activity = await Activity.create(data);
    return NextResponse.json({ message: 'Activity added successfully', activity }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
