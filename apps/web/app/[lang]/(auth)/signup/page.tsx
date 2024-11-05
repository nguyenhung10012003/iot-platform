import SignupForm from '../../../../components/auth/SignupForm';
import { getDictionary } from '../../../dictionaries';

export default async function SignupPage({params} : {params: {lang: string}}) {
  const dictionary = await getDictionary(params.lang);
  return <SignupForm dictionary={dictionary}/>;
}
