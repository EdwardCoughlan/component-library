import React from 'react';
import { render } from '@testing-library/react';
import { Bloc, BlocContext, ComponentMapper } from './bloc';

const ComponentWithNoProps: React.FC = () => <div>Test with no props</div>;

type ComponentProps = {
  contents: string;
};
type ComponentProps2 = {
  alteredContents: string;
};

const ComponentWithProps: React.FC<ComponentProps> = (props) => (
  <div>{props.contents}</div>
);
const ComponentWithProps2: React.FC<ComponentProps2> = (props) => (
  <div>{props.alteredContents}</div>
);
const ComponentWithProps3: React.FC<ComponentProps2> = (props) => (
  <div>{props.alteredContents}</div>
);

const Mappers: Record<string, (props: unknown) => unknown> = {
  componentWithProps2: (props): ComponentProps2 => {
    return {
      alteredContents: `Altered ${(props as ComponentProps).contents}`,
    };
  },
  componentWithProps3: (): void => {
    throw new Error('Oh shit');
  },
};

const componentMappers: Record<string, ComponentMapper> = {
  componentWithNoProps: { component: ComponentWithNoProps },
  componentWithProps: { component: ComponentWithProps },
  componentWithProps2: {
    component: ComponentWithProps2,
    mapper: Mappers['componentWithProps2'],
  },
  componentWithProps3: {
    component: ComponentWithProps3,
    mapper: Mappers['componentWithProps3'],
  },
};

test('BLoc component without props', () => {
  const { container } = render(
    <Bloc
      id="1"
      componentMapperIdentifier="componentWithNoProps"
      componentMappers={componentMappers}
    />
  );

  expect(container).toMatchSnapshot();
});

test('Bloc component with props', () => {
  const test = "I am a component with props. That doesn't use a mapper";
  const { container } = render(
    <Bloc
      id="1"
      componentMapperIdentifier="componentWithProps"
      props={{
        contents: test,
      }}
      componentMappers={componentMappers}
    />
  );
  expect(container).toMatchSnapshot();
});

test("BLoc component doesn't exists", () => {
  const { container } = render(
    <Bloc
      id="1"
      props={{
        content: "I am a component that doesn't exists",
      }}
      componentMapperIdentifier="componentThatDoesNotExists"
      componentMappers={componentMappers}
    />
  );
  expect(container).toMatchSnapshot();
});

test('Bloc component with props to be mapped', () => {
  const { container } = render(
    <Bloc
      id="1"
      componentMapperIdentifier="componentWithProps2"
      props={{
        contents: 'I am a component with props. That that will be mapped',
      }}
      componentMappers={componentMappers}
    />
  );
  expect(container).toMatchSnapshot();
});

test('Bloc component with props to be mapped error', () => {
  try {
    render(
      <Bloc
        id="1"
        componentMapperIdentifier="componentWithProps3"
        props={{
          contents:
            'I am a component with props. That that will be mapped but an error will happen',
        }}
        componentMappers={componentMappers}
      />
    );
  } catch (err) {
    console.log(err.message);
    expect(err).toBeTruthy();
  }
});

test('Bloc with component coming from BlocContext', () => {
  const ContextComponent = (props: { fromContext: string }) => (
    <div>{`context : ${props.fromContext}`}</div>
  );
  const { container } = render(
    <BlocContext.Provider
      value={{
        componentMappers: {
          componentFromContext: {
            component: ContextComponent,
            mapper: (props) => {
              return {
                fromContext: props.contents,
              };
            },
          },
        },
      }}
    >
      <Bloc
        id="1"
        componentMapperIdentifier="componentFromContext"
        props={{
          contents: 'I am a component that is a part of the global context.',
        }}
        componentMappers={componentMappers}
      />
    </BlocContext.Provider>
  );
  expect(container).toMatchSnapshot();
});

test('No component mappers secified', () => {
  const { container } = render(
    <Bloc
      id="1"
      componentMapperIdentifier="componentFromContext"
      props={{
        contents: 'I am a component that is a part of the global context.',
      }}
    />
  );
  expect(container).toMatchSnapshot();
});
