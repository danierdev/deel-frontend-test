# Deel Interview Answers

## 1. What is the difference between Component and PureComponent? give an example where it might break my app.

The main difference between Component and PureComponent is that PureComponent handles the `shouldComponentUpdate`
lifecycle transparently, while Component requires the user to implement it if needed.

## 2. Context + ShouldComponentUpdate might be dangerous. Can think of why is that?

The context is used to prevent passing props all the way through the children components. This means that any children
can make use of the context to use some data provided by the context.
On the other hand, `shouldComponentUpdate` would not be aware if the context changes, because it receives only the
next prop and next state, which in this case might not change. So, if for example we have a PureComponent which
uses the context, and the context changes, the component won't be updated.

## 3. Describe 3 ways to pass information from a component to its PARENT.

- Using a callback prop, which can be handled by the parent when it changes. For example:

```javascript
function ChildComponent({ text, onChange }) {
  function handleChange(event) {
    onChange(event.target.value)
  }

  return (
    <input type="text" value={text} onChange={handleChange} />
  )
}

function ParentComponent() {
  function handleChange(value) {
    // do something with value
  }

  return (
    <main>
      <ChildComponent text='test' onChange={handleChange} />
    </main>
  )
}
```

- Updating the context from a child component. Let's assume we have created a custom language provider
  to manage the context.

```javascript
const LanguageContext = createContext(['en', () => {}]);

function App() {
  const value = useState('en');
  return (
    <LanguageContext.Provider value={value}>
      <LanguageSwitcher />
    </LanguageContext.Provider>
  )
}

function LanguageSwitcher() {
  const [language, setLanguage] = useContext(LanguageContext);

  return (
    <button onClick={() => setLanguage('jp')}>
      Switch Language (Current: {language})
    </button>
  )
}
```

- Using some external state manager, such as Redux, MobX where we can dispatch an action which can update some
  parent information.

## 4. Give 2 ways to prevent components from re-rendering

- One way is to use `shouldComponentUpdate` method, or defining the component as React.PureComponent in class
  based components.

- For functional components, we can use the PureComponent equivalent, wrapping the component within `React.memo` HOC

## 5. What is a fragment and why do we need it? Give an example where it might break my app.

A fragment is a component in where you can include some children within it, but it won't create a DOM node.
We could need it, for example if we have to list some content right next to an existing node.
For example, this code:

```javascript
function App() {
  // The JSX returned here needs to be one node, which includes other nodes.
  // It cannot return all de siblings without them to be wrapped
  // This breaks your app
  return (
    <div>App content</div>
    <LanguageSwitcher />
  )
}
```

To correct this error we wrap the components in a fragment, you can import it from react or use the short syntax `<>code here</>`

```html
return (
  <>
    <div>App content</div>
    <LanguageSwitcher />
  </>
)
```

## 6. Give 3 examples of the HOC pattern.

- React Router HOC:

We can have access to router props (`history`, `location` ...) using `withRouter` HOC:

```javascript
const NavbarWithRouter = withRouter(Navbar);
```

- Redux connect HOC:

We can wrap our component within Redux connect HOC, passing the state and dispatch as props to it:

```javascript
// connect is a function that returns another function
const enhance = connect(commentListSelector, commentListActions);
// The returned function is a HOC, which returns a component that is connected
// to the Redux store
const ConnectedComment = enhance(CommentList);
```

- A custom HOC

Here is an example of a very simple HOC, which allows adding functionality when the component did mount.

```javascript
export default function doesSomethingOnMount(Component) {
  return class extends Component {
    static displayName = Component.displayName || Component.name;

    componentDidMount() {
      super.componentDidMount && super.componentDidMount();
      // do your stuff here
    }
  };
}
```


## 7. What is the difference in handling exceptions in promises, callbacks and async...await?

### Callbacks

In this case we pass a callback function to the called function, so the callback will handle what
should happen at some point. The callback usually receives (from the called function) two args.
One is the result itself, and the other is the error, in case something went wrong.
For example:

```javascript
getUserInfo(userId, (error, result) => {
  if (error) {
    // handle the error in some way
  } else {
    // do something with result
  }
})
```

### Promises

Here the function returns a promise, and the way to handle errors is:

```javascript
getUserInfo(args)
  .then(result => {
    // do something with result
  })
  .catch(error => {
    // handle the error in some way
  })
```

### Async/Await

This is another way of handling promises, in a more straight-forward way:

```javascript
try {
  const user = await getUserInfo(args)
  // do something with result
} catch (error) {
  // handle the error in some way
}
```

## 8. How many arguments does setState take and why is async

The `setState` method is used to set a state in a class component and receives 2 arguments:
- The new state value
- A callback, that will be executed when the state actually changes

It is an async method for performance reasons, so React updates all the states in the next render

## 9. List the steps needed to migrate a class to function component

- Change the class expression to a function
- All the class methods, must be converted to functions
- Get rid of `this` references, since all the methods/attributes will be within the function scope
- The state initialized in the constructor, must be initialized with the `useState` hook
- All the logic within the lifecycle methods, should be handled by `useEffect` hooks.
  For example, for componentDidMount: `useEffect(() => { ... }, [])` (effect with no dependencies)
- The return JSX in `render` method should be returned by the functional component.

## 10. List a few ways styles can be used with components

### Inline styles

You can give a component inline styles through `style` prop:

```javascript
<main style={{ backgroundColor: '#ddd', padding: 0 }}>App content</main>
```

### Pure CSS

In this case we can use directly the strings declared in the CSS file.
For example, referring to the previous css example:

```javascript
import './styles.css';

...

<main className="appWrapper">App content</main>
```

### CSS Modules / CSS in JS libraries (styled-components, emotion).

You can get an object with the styles from an actual CSS file, using modules.
For example, given the CSS:

```css
.appWrapper {
  margin: 0;
  display: flex;
  min-width: 320px;
}
```

We can import and use it as follows:

```javascript
import styles from './styles.module.css';

...

<main className={styles.appWrapper}>App content</main>

```

## 11. How to render an HTML string coming from the server

React automatically escapes the HTML tags, for security reasons. So, if I receive
an HTML string from the server and try to display it directly:

```javascript
<main className='appWrapper'>
  {htmlString}
</main>
```

the browser will print the HTML exactly as is, so no changes in the DOM will be reflected.

In order to be able to actually render the HTML received, we should use `dangerouslySetInnerHTML`
prop. For example:

```javascript
<main
  className='appWrapper'
  dangerouslySetInnerHTML={{ __html: htmlString }}
/>
```
