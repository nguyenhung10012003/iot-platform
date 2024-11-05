import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { getDictionary } from '../../../dictionaries';

export default async function SettingPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);
  return (
    <div className="flex items-center h-full flex-col gap-4 p-4 md:p-6">
      <h1 className="text-xl font-semibold">{dictionary.settings}</h1>
      <div className="flex w-full justify-between items-center">
        <h2 className="font-semibold">{dictionary.language}</h2>
        <Select>
          <SelectTrigger className="w-full max-w-[200px]">
            <SelectValue defaultValue={'vi'} placeholder={dictionary.chooseLanguage} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={'en'}>{dictionary.english}</SelectItem>
            <SelectItem value={'vi'}>{dictionary.vietnamese}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
