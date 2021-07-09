import { NextPage } from 'next';import { useEffect, useState } from 'react';const Home: NextPage<{ name: string }> = (props) => {  const { name } = props;  const [state, setState] = useState<string>('hello');  useEffect(() => {    setTimeout(() => {      setState('hello world');    }, 1000);  }, []);  return (    <h1 className="mt-12 text-3xl font-bold text-center">{`${state}, ${name}`}</h1>  );};Home.getInitialProps = ({ query }): { name: string } => {  return {    name: query.name as string,  };};export default Home;