import * as React from 'react';
import Link from 'next/link';
import { getTokenImageLink } from '../../utils/image';

const TokenCard = ({ token }: any) => {
  return (
    <Link
      href={`/?viewId=${token.id}`}
      as={`/view/${token.id}`}
      passHref
      scroll={false}
    >
      <a>
        <div className="max-w-screen-md dark:bg-gray-900 bg-gray-50 shadow-sm rounded-lg cursor-pointer border border-gray-200 dark:border-gray-700 overflow-hidden">
          {token && (
            <>
              <div className="grid items-start">
                <div className="bg-white dark:bg-gray-900 dark:text-gray-200 overflow-hidden px-3 py-2 h-full md:col-span-2 border-none flex flex-col">
                  <div>
                    <h2 className="font-semibold text-sm text-gray-500 dark:text-gray-100 tracking-wide mb-1 mt-1">
                      <span className="tracking-normal mr-2">Rank</span>#
                      {token.rank}
                    </h2>
                    <div className="bg-black block rounded-md overflow-hidden transition duration-150 ease hover:scale-105">
                      <img
                        style={{ minHeight: '200px', minWidth: '200px' }}
                        src={getTokenImageLink(token.image)}
                        alt={token.name}
                      />
                    </div>
                    <div className="hover:text-blue-600 dark:hover:text-blue-300">
                      <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 tracking-tight leading-tighter my-3">
                        {token.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </a>
    </Link>
  );
};

export default TokenCard;
