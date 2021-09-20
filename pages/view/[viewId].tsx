import { useRouter } from 'next/router';
import Token from '../../components/Token';
import { rarityStore } from '../../helpers/rarity';

function Post({ post, traits, meta }: any) {
  const router = useRouter();
  const { postId } = router.query;

  return (
    <div className="bg-white dark:bg-gray-900 ">
      <div
        className="max-w-7xl px-4 py-10 mx-auto sm:px-6 lg:px-8"
        style={{ minHeight: 'calc(100vh - 140px)' }}
      >
        <Token
          traits={traits}
          id={postId}
          pathname={router.pathname}
          token={post}
          meta={meta}
          isPage
        />
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const posts: any = rarityStore.getAll();

  const paths = Object.keys(posts)
    .slice(0, 20)
    .map((post: any) => ({
      params: { viewId: posts[post].id.toString() }
    }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }: any) {
  const post = rarityStore.getById(params.viewId);
  const traits = rarityStore.getTraits();
  const meta = rarityStore.getMeta();

  return {
    props: { post, traits, meta },
    revalidate: false
  };
}

export default Post;
