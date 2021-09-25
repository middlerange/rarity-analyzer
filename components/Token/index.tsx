import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { getTokenImageLink } from '../../utils/image';
import { CloseIcon } from '../Icons';
import MarketPlaceLinks from './MarketPlaceLink';

const Token = ({ token, traits, meta, isPage, close }: any) => {
  return (
    <div
      className={` bg-transparent mx-auto ${
        isPage ? 'overflow-auto max-w-screen-xl' : 'max-w-screen-lg'
      }`}
      style={{
        height: isPage ? 'auto' : 'calc(100vh - 40px)',
        margin: isPage ? '0' : '0 40px'
      }}
    >
      {!isPage && (
        <div className="w-16 h-12 p-4 z-50 fixed top-0 right-0">
          <div
            className="transition duration-150 ease hover:scale-110 cursor-pointer w-6 h-6 bg-white rounded-full flex items-center justify-center text-gray-700"
            onClick={close}
          >
            <CloseIcon />
          </div>
        </div>
      )}
      {token && (
        <>
          <div
            className={`grid md:grid-cols-4 grid-cols-1 gap-3 items-start sm:mt-0 ${
              !isPage ? 'animated-fadeInUp' : ''
            } `}
          >
            <div className="bg-transparent dark:text-gray-200 shadow-sm rounded-lg overflow-hidden px-2 h-full md:col-span-2 border-none flex flex-col py-0">
              <div>
                {/* <h2 className="uppercase font-semibold text-xs text-gray-700 dark:text-gray-200">
									Rarity Rank #{token.rank}
								</h2> */}
                <img
                  src={getTokenImageLink(token.image)}
                  alt={token.name}
                  style={{
                    minHeight: '340px',
                    minWidth: '340px',
                    width: '100%'
                  }}
                  className="rounded-lg bg-black border-gray-800 dark:border-gray-800 border"
                />
              </div>
            </div>
            <div className="overflow-hidden md:col-span-2 rounded-lg">
              <div
                className="overflow-scroll rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200 shadow-sm  p-6  border-none flex flex-col sm:py-6 py-6"
                style={{ maxHeight: isPage ? 'auto' : 'calc(100vh - 88px)' }}
              >
                <h3 className="uppercase text-sm font-semibold text-gray-500 tracking-normal leading-tighter mt-0">
                  {process.env.NEXT_PUBLIC_SITENAME}
                </h3>
                <div className="hover:text-blue-600 dark:hover:text-blue-300">
                  <h3 className="text-xl font-bold tracking-tight leading-tighter mt-1">
                    {token.name}
                  </h3>
                </div>

                <MarketPlaceLinks id={token.id} />

                <div className="flex flex-col justify-center px-3 py-3 bg-gray-50 dark:bg-gray-900 dark:border-gray-900 border border-gray-200 rounded shadow-sm mt-2">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-center text-gray-800 dark:text-gray-100">
                      Rank
                    </div>
                    <div className="text-lg font-semibold text-center text-gray-800 dark:text-gray-100">
                      {token.rank}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-md text-center text-gray-500">
                      Rarity Score
                    </div>
                    <div className="text-md text-center text-gray-500">
                      {Math.floor(token.rarity_score * 1e4) / 1e4}
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold tracking-tight leading-tighter mt-8">
                  Description
                </h3>
                <div className="description text-gray-500 text-sm prose dark:prose-dark dark:prose-sm-dark prose-sm mb-2">
                  <ReactMarkdown>{token.description}</ReactMarkdown>
                </div>

                <div>
                  <h2 className="text-lg font-semibold tracking-tight leading-tighter mt-8">
                    Attributes Rarity
                  </h2>
                  {[...token.attributes, ...token.missing_traits].map(
                    (trait: any) => (
                      <div
                        className="pt-3"
                        key={`${token.id}-${trait.trait_type}`}
                      >
                        <div className="p-1 py-2 bg-gray-50 dark:bg-gray-900 shadow-sm rounded-md">
                          <div className=" flex items-center justify-between text-base font-medium text-gray-900 space-x-8 pt-2 px-1">
                            <div className="uppercase text-sm font-bold text-gray-400 dark:text-gray-200">
                              {trait.trait_type}
                            </div>
                            <div className="text-sm font-medium text-blue-600 dark:text-gray-300">
                              +{trait.rarity_score}
                            </div>
                          </div>
                          <div className=" flex items-center justify-between text-base font-medium text-gray-900 space-x-8 py-0 px-1  ">
                            <div className="text-md font-medium text-gray-800 dark:text-gray-200 capitalize">
                              {trait.value || '<none>'}
                            </div>
                            <div className="text-sm font-bold text-gray-900 dark:text-gray-200">
                              {traits && trait.value
                                ? traits[trait.trait_type][trait.value].count
                                : meta && meta.totalCount - trait.count}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Token;
