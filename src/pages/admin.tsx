import { requireClientEditor } from "src/lib/auth/requireClientEditor";
import defaultData from "src/lib/defaultData";
import { getSiteContent } from "src/lib/getSiteContent";
import { supabaseService } from "src/lib/supabase/supabaseService";

import EditorScreen from "@screens/EditorScreen/EditorScreen";

const Home = ({ content, userEmail }: any) => {
  return <EditorScreen content={content} userEmail={userEmail} />;
};

export default Home;

export const getServerSideProps = async (ctx: any) => {
  const access = await requireClientEditor({ ctx });

  if (!access.ok && access.status === 401) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  if (!access.ok) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  const supabase = supabaseService();
  const content = await getSiteContent(supabase);

  return {
    props: {
      content: content || defaultData,
      userEmail: access.user.email ?? null,
    },
  };
};
