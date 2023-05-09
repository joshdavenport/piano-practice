import { ConfigPractice } from '@/app/components/ConfigPractice';

export const metadata = {
  title: 'Piano Practice Configure',
};

export const revalidate = 86400;

export default function Home() {
  return (
    <div className="flex items-center justify-center gap-4 border-b pb-4">
      <ConfigPractice />
    </div>
  );
}
