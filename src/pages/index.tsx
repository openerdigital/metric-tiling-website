import defaultData from "src/lib/defaultData";
import { getSiteContent } from "src/lib/getSiteContent";
import { supabaseService } from "src/lib/supabase/supabaseService";

import { HomeScreen } from "@screens/HomeScreen";

const Home = ({ content }: any) => {
  return <HomeScreen content={content} />;
};

export default Home;

export const getStaticProps = async () => {
  const supabase = supabaseService();
  const content = await getSiteContent(supabase);

  return {
    props: { content: content || defaultData },
    revalidate: false, // required for on-demand revalidation
  };
};
