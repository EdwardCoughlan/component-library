/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  createElement,
  FunctionComponentElement,
  useContext,
} from 'react';

export type ComponentMapper = {
  component: React.FC<any>;
  mapper?: (props: any) => any;
};

export type BlocProps = {
  id: string;
  props?: any;
  componentMapperIdentifier: string;
  componentMappers?: Record<string, ComponentMapper>;
};

export const BlocFn = ({
  id,
  props,
  componentMapperIdentifier,
  componentMappers = {},
}: BlocProps):
  | FunctionComponentElement<{
      key: string;
    }>
  | FunctionComponentElement<any> => {
  if (typeof componentMappers[componentMapperIdentifier] === 'undefined') {
    return createElement(
      () => (
        <div>
          The component {componentMapperIdentifier} has not been created yet.
        </div>
      ),
      { key: id }
    );
  }
  const componentMapper = componentMappers[componentMapperIdentifier];
  const componentProps =
    !!props && !!componentMapper.mapper ? componentMapper.mapper(props) : props;
  return createElement(componentMapper.component, {
    ...componentProps,
    key: id,
  });
};

export const BlocContext = createContext<{
  componentMappers?: Record<string, ComponentMapper>;
}>({ componentMappers: undefined });

export function Bloc({
  componentMappers,
  ...restOfProps
}: BlocProps): JSX.Element {
  const context = useContext(BlocContext);
  if (context && context.componentMappers) {
    const contextLevelComponentMappers = context.componentMappers;
    for (const k in componentMappers) {
      const key = k as keyof typeof componentMappers;
      contextLevelComponentMappers[key] = componentMappers[key];
    }
    return BlocFn({
      componentMappers: contextLevelComponentMappers,
      ...restOfProps,
    });
  }
  return BlocFn({ componentMappers, ...restOfProps });
}

