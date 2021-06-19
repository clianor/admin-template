import React from 'react';
import { NextPage } from 'next';

const Home: NextPage<{ name: string }> = (props) => {
  const { name } = props;
  return (
    <h1 className="mt-12 text-3xl font-bold text-center">{`Hello, ${name}`}</h1>
  );
};

Home.getInitialProps = ({ query }): { name: string } => {
  return {
    name: query.name as string,
  };
};

export default Home;
