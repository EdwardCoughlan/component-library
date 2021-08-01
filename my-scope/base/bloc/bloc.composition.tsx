import React from 'react';
import { Bloc, BlocContext } from './bloc';

const ExampleBasicBloc = ({contents}: {contents: string}) =>(
  <div>{contents}</div>
)

export const BasicBloc = () => (
  <Bloc 
  id="basicBloc"
  componentMapperIdentifier="basicBloc"
  props={{unmappedContent: 'hi I am unmapped content' }}
  componentMappers={
    {
      basicBloc: {
        component: ({contents}) => <div>{contents}</div>, 
        mapper: (props) =>({contents: props.unmappedContent.replace('unmapped', 'mapped')})
      }
    }
  }
/>
);


export const ContextBloc = () => (
  <BlocContext.Provider value={{componentMappers: {
    contextBlocComponent: {
      component: ExampleBasicBloc, 
      mapper: ({unmappedContent}) =>{return {contents: `${unmappedContent.replace('unmapped', 'mapped')} from global context`}}
    }
  }}}>
    <Bloc 
      id="basicBloc"
      props={{unmappedContent: 'hi I am unmapped content' }}
      componentMapperIdentifier="contextBlocComponent"
    />
  </BlocContext.Provider>
);
