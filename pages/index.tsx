import * as React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import RarityList from '../components/RarityList';
import SocialLinks from '../components/SocialLinks';
import Token from '../components/Token';
import { rarityStore } from '../helpers/rarity';
import { modalStyles } from '../utils/styles';

const Home: NextPage = ({ traits, count, intialTokens, meta }: any) => {
  const router = useRouter();

  const [tokens, setTokens] = React.useState(intialTokens);
  const [activeToken, setActiveToken] = React.useState<any>();

  const getActiveToken = () => {
    const listToken = tokens.data.find(
      (token: any) => token.id === Number(router.query.viewId)
    );
    if (listToken) setActiveToken(listToken);
    setActiveToken(rarityStore.getById(router.query.viewId));
  };

  const close = () => {
    router.back();
  };

  React.useEffect(() => {
    getActiveToken();
  }, [router.query.viewId]);

  return (
    <>
      <Modal
        isOpen={!!router.query.viewId}
        style={modalStyles}
        ariaHideApp={false}
        className="bg-transparent p-2 z-30 relative h-screen bg-white rounded-lg overflow-hidden"
        onRequestClose={close}
        contentLabel="token view modal"
      >
        <Token
          id={router.query.viewId}
          pathname={router.pathname}
          token={activeToken}
          count={count}
          traits={traits}
          meta={meta}
          close={close}
        />
      </Modal>

      <div className="dark:bg-gray-900 bg-white pt-6">
        {/* {process.env.NEXT_PUBLIC_FULLWIDTH_BANNER && (
					<div
						className="md:col-span-1 my-8 bg-white bg-gray-50 shadow-sm dark:bg-gray-800 dark:text-gray-200 shadow-sm border border-gray-50 dark:border-gray-900 h-full relative items-start overflow-hidden rounded-md grid md:grid-cols-1 xl:px-0 px-5 max-w-screen-xl w-full mx-auto"
						style={{ minHeight: "240px" }}
					>
						<img
							src={process.env.NEXT_PUBLIC_FULLWIDTH_BANNER}
							alt="site banner"
						/>
					</div>
				)} */}
        {process.env.NEXT_PUBLIC_SHOW_BANNER && (
          <div className="w-full flex flex-col flex-grow px-5 dark:bg-gray-900 dark:text-gray-100">
            <div className="pb-10 xl:px-0 px-5 max-w-screen-xl w-full mx-auto dark:bg-gray-900">
              <div className="md:col-span-8 bg-white bg-gray-50 shadow-sm dark:bg-gray-800 dark:text-gray-200 shadow-sm border border-gray-50 dark:border-gray-900 h-full relative items-start overflow-hidden rounded-md  grid md:grid-cols-10 md:gap-2 ">
                <div
                  className="md:col-span-2 flex flex-col items-center justify-center h-full relative ml-2"
                  style={{ minHeight: '240px' }}
                >
                  <div className="block overflow-hidden absolute m-0 md:w-40 sm:w-full">
                    <img
                      alt="collection banner"
                      src={process.env.NEXT_PUBLIC_BANNER}
                    />
                  </div>
                </div>
                <div className="md:col-span-5  flex flex-col justify-start h-full p-8">
                  <h1 className="sm:text-2xl text-xl font-bold ">
                    {process.env.NEXT_PUBLIC_SITENAME}
                  </h1>
                  <SocialLinks />
                  <div className="prose dark:prose-dark pt-2 sm:text-base text-sm leading-thight text-gray-800 dark:text-gray-200 mt-2 md:mt-6">
                    <p>{process.env.NEXT_PUBLIC_DESCRIPTION}</p>
                  </div>
                </div>
                {/* <div className="overflow-hidden sm:col-span-2 col-span-2 w-full h-full ">
									//  opensea stats
								</div> */}
              </div>
            </div>
          </div>
        )}

        <div className="max-w-screen-xl mx-auto sm:px-5 md:px-0">
          <RarityList
            tokens={tokens}
            setTokens={setTokens}
            count={count}
            traits={traits}
            meta={meta}
          />
        </div>
      </div>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  return {
    props: {
      traits: rarityStore.getTraits(),
      count: rarityStore.getCount(),
      intialTokens: rarityStore.getPage({
        traitCount: [],
        limit: 20,
        offset: 0,
        traits: []
      }),
      meta: rarityStore.getMeta()
    }
  };
}
