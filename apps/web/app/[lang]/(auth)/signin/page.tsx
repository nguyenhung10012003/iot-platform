import SigninForm from '../../../../components/auth/SigninForm';
import { getDictionary } from '../../../dictionaries';

export default async function SignInPage({params} : {params: {lang: string}}) {
  const dictionary = await getDictionary(params.lang);
  return <SigninForm dictionary={dictionary}/>;
}
