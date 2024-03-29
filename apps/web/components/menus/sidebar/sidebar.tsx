import Link from 'next/link';
import { NavigationMenuProps } from 'types/navigation';

export default function Sidebar({
  selectedPage,
  navigation,
}: {
  selectedPage: string;
  navigation: NavigationMenuProps;
}): JSX.Element {
  return (
    <div className="flex flex-col gap-2.5">
      {navigation.items.map((item) => (
        <Link
          href={item.href}
          className={`w-[200px] py-2.5 px-5 flex gap-2.5 items-center hover:bg-slate-50 rounded-md box-content ${
            selectedPage === item.href
              ? 'bg-slate-50 ring-2 ring-slate-300'
              : ''
          }`}
          key={item.href}
        >
          {item.image}
          <div className='font-semibold text-sm'>{item.label}</div>
        </Link>
      ))}
    </div>
  );
}
