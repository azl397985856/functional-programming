# 函数式编程-入门
本篇文章是我的函数式编程教程中的第一篇文章，目的是让
大家对函数式编程有一个概念，为后面学习函数式编程提供基础。

## 介绍
函数式编程不过是相比于传统的面向过程和面向对象的一种新的编程方法而已。

他的出现并不是为了取代谁，也不会取代。他的出现只是为了改善传统的
编程方法中存在的问题。典型的一个作用就是就是限制系统的副作用。然而函数式编程
并不是用来消灭副作用，这是不切实际的。他的存在只是将副作用限制到某一个很小的范围。
使我们的程序的大部分逻辑都是纯粹的。

然而函数式编程离不开数学，你可以从函数式编程中看到数学之美。
你在初中高中大学用到的很多公式理论在这里都适用，很神奇，不是嘛？
让我们开始学习吧~
## 函数
一个常见的误解就是函数式编程中的函数指的就是用函数写代码。
比如JavaScript就是function。 这种理解是完全错误的。

然而函数式编程中的函数其实指的是数学中的函数。
让我们来回忆一下初中数学。
### 数学中的函数
我们来看下数学中的函数的定义：

> 给定一个数集A，假设其中的元素为x。现对A中的元素x施加对应法则f，记作f（x），得到另一数集B。
假设B中的元素为y。则y与x之间的等量关系可以用y=f（x）表示。我们把这个关系式就叫函数关系式，简称函数。

函数概念含有三个要素：定义域A、值域C和对应法则f。其中核心是对应法则f，它是函数关系的本质特征。


函数式编程中的函数正是数学中的函数，而JavaScript中的函数是其超集。
这也就是为什么很多数学公式理论在函数式编程中都适用的原因。
### 纯函数
上面介绍了数学中的函数，我们已经知道了函数式编程中的函数指的正是数据中的函数。
那么数学中的函数在JavaScript中又是什么呢？

数学中的函数指的Javascript中的纯函数。

> 这种说法不准确，因此纯函数并不是Javascript的术语，这里只是方便解释。

那么什么是纯函数？

> 纯函数就是给定输入，输出总是相同的函数。

我们在学习初中数学中的函数的时候，学过`定义域中的一个元素在值域有且仅有一个对应的值`。
这个其实和纯函数的定义是一致的。

纯函数的好处就是无副作用，不管我是执行一次，还是一百次，结果总是一样的。
那么这有什么用呢?

- 可预测(也可以叫可测试)

一个很明显的好处就是可预测，即根据输入就可以知道输出。
利用这个特性，我们就可以很容易的去断言输出，也就更容易测试。

redux声称是可预测的状态管理容器， 其可预测正是归功于纯函数的特性。
redux中的reducer被要求是一个纯函数，所有的状态变化都经过reducer这个
纯函数去完成。 这样应用的状态(准确地讲是redux的store)就变得可预测，
也就方便测试。

- 可缓存

由于给定输入，输出总是一定的。那么我们就可以将函数结果缓存起来，当
`后续`调用的时候就可以直接从缓存中拿，避免了重新执行的开销。
这在大运算中是非常重要的。

很多函数式编程库都实现了memorize方法，我们拿ramda为例,
如下是ramda的官方文档对memorize的代码演示：

```js
let count = 0;
const factorial = R.memoize(n => {
  count += 1;
  return R.product(R.range(1, n + 1));
});
factorial(5); //=> 120
factorial(5); //=> 120
factorial(5); //=> 120
count; //=> 1
```

- 可并行

函数式编程由于其纯函数的特性，是天然支持并行的。
因为其不会因为时间的改变而导致函数的执行出现改变。
换句话说，在函数式编程中，时间并不是自变量。

## 一等公民
函数式编程的本质是将函数当作一等公民。

在理解这个概念以前，我们先来看下高阶函数。
### 高阶函数
高阶函数要么是以函数作为参数，要么以函数作为返回值，要么兼而有之。

一个简单的例子：

```js
// 常见写法
function add(x) {
  return y => x + y;
}

// 箭头函数写法
const add = x => y => x + y;

const addOne = add(1);
addOne(2); // 3
```
> 为了保持代码的简洁性，后面都采用箭头函数的形式书写。

然后js里面的map，sort，reduce等都是地地道道的高阶函数。
可以说我们一直在使用高阶函数，只是我们并不知情。就好像我们一直在使用闭包，
却可能并不知道闭包的概念一样。

事实上，js中的事件也是高阶函数。

```js
// 将函数作为参数传入
document.addEventListener("click", e => e);
```
高阶函数大大提高了代码的抽象能力，进而提高了代码的复用率。
通过传入不同的函数进而实现不同的效果，毫不夸张地讲，这种
抽象非常强大。理解高阶函数对于理解函数式编程至关重要，他是函数式编程中的基石。
## 柯里化
柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，
并且返回接受余下的参数且返回结果的新函数的技术。

听起来比较拗口，让我们通过一个例子来看下。
```js
// 取出对象里面的属性, 简单起见，省略了校验逻辑
const get = key => obj => obj[key]
const getId = get("id")
const getName = get("name")

const data = {
  id: 1,
  name: 'lucifer'
}
getId(data); // 1
getName(data); // lucifer
```

上面的例子非常简洁，我们称之为pointfree风格。
让我们再看下非柯里化版本

```js
const getByKey = (key, obj) => obj[key]

// 繁琐
const getId = data => getByKey("id", data);
const getName = data => getByKey("name", data);

const data = {
  id: 1,
  name: 'lucifer'
}

getId(data); // 1
getName(data); // lucifer
```

由于非柯里化版本必须提供所有参数才能执行。
因此构造出的getId和getName必须提供data。
可能这个例子还不太明显，我们会在后面将pointfree部分举一个更复杂的例子。

其实我们前面将高阶函数部分举的add的例子已经是柯里化了。
add本身接受两个参数，然后通过柯里化的方式将其编程接受一个参数的函数，执行它，
你得到了一个接受一个参数的值，再次执行，才会返回相加的结果。

纯正的函数式编程中，所有的函数都只有一个参数。
这样再js中就会写成这样`getId('id')(data)`。我们必须写下两个括号，
这是由于js本身的语法决定的，对于scala，haskell等函数式语言，不存在这样的事情。
因此我们通常使用一些函数式编程库帮我们简化成`getId('id', data)`的写法。
当然这并不以为着getId就不柯里化了。这只是一个语法糖而已。
## 组合
通过柯里化我们将多个参数的函数变成只接受一个参数的高阶函数。
本节我们通过函数组合，将不同的函数组合形成各种不同的新的函数。

函数组合就是将函数串联起来执行，将多个函数组合起来，一个函数的输出结果是另一个函数的输入参数，一旦第一个函数开始执行，就会像多米诺骨牌一样推导执行了。

举个例子：
```js
const add = x => y => x + y;
const addOne = add(1);
const plus = x => y => x * y;
const plusFive = plus(5);

const addOneAndPlusFive = compose(plusFive, addOne)

addOneAndPlusFive(3); // 20
```

上面的例子很简单，就是将addOne 和 plusFive 这两个函数给组合起来，形成了一个新的函数而已。
类似的我们可以组合创造出无数的方法来。

如下是redux的compose的实现，可以帮助大家理解它是怎么运作的。

```js
function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```
如上使用reduce方法将函数累计到一起，形成一个新的函数。
## Pointfree
终于到了文章的重点了。

其实前面已经提到了pointfree了。我们通过curry已经实现了pointfree风格。
但是这并不是全部。事实上要实现pointfree除了借助curry，还需要将可变化的数据放在最后（data goes last）。

前面的例子不足以解释这一点，我们举一个稍微复杂且贴近实际的例子：

如下是后端返回的数据格式
```json
[{
    "user": "lucifer",
    "posts": [
        { "title": "fun fun function", "contents": "..." },
        { "title": "time slice", "contents": "..." }
    ]
}, {
    "user": "lucifer",
    "posts": [
        { "title": "babel", "contents": "..." },
        { "title": "webpack", "contents": "..." }
    ]
}, {
    "user": "karl",
    "posts": [
        { "title": "ramda", "contents": "..." },
        { "title": "lodash", "contents": "..." }
    ]
}]

```
我们需要做的就是找到所有lucifer的文章，并将其title打印出来。

非pointfree的写法：

```js
fetch(url)
    .then(JSON.parse)
    .then(datas => datas.filter(data => data.user === 'lucifer'))
    .then(datas => datas.map(data => data.posts).reduce((pre, next) => pre.concat(next)))
    .then(posts => posts.map(post => post.title))

```
pointfree的写法：

```js
// 这里为了演示，并没有将fetch这样的副作用函数进行包装
fetch(url)
    .then(JSON.parse)
    .then(filter(compose(equals('lucifer'), get('user'))))
    .then(chain(get('posts')))
    .then(map(get('title')))
```

看到了嘛，整个过程我们没有提到data。 我们不需要提到data。
代码精简了很多，逻辑纯粹了很多。

> 我们再也不必为变量命名而苦恼了

上面用到了一个api`chain`， 可能不太好理解，我会在函数式编程-进阶部分讲解。
现在你可以把它理解为将数组拍平，就好像我在非函数式写法中的那样。

另一个比较难以理解的地方在于`filter(compose(equals('lucifer'), get('user')))`

我们来看一下：

```js
// 这样的写法更容易理解，但是它不pointfree
filter(data => equals(get('user')(data), 'lucifer'))

// 等价于下面的写法（加法交换律）

filter(data => equals('lucifer', get('user')(data)))

// 等价于下面的写法（curry）
filter(data => equals('lucifer')(get('user')(data)))

// 把equal('lucifer') 看成f， get('user') 看成g
// 上面的代码本质上是f(g(x)) 
// 因此等价于下面的写法（compose）   f(g(x)) = compose(f, g)(X)
filter(data => compose(equals('lucifer'), get('user'))(data)) 

// 所有的形如 x => fn(x) 的代码都等价于 fn
// 因此上面的代码等价于
filter(compose(equals('lucifer'), get('user'))) 
```
通过curry， compose，data goes last一系列技巧，我们写出了pointfree的
代码。 pointfree风格是函数式编程中特别重要的概念。pointfree使得开发者写出的
代码更加容易重用，仅仅面向逻辑，而将具体的数据抽离出来。而且直观上来讲，代码
更加简洁。这还仅仅是一个小小的例子，现实中情况会复杂地多，其重要性不言而喻。

## 总结
本文从数学中的函数入手，讲述了函数式编程中的函数其实就是数学中的函数。
接着我们讲述了纯函数以及其优点。然后我们讲述了函数式编程中的两个基础概念，curry和compose。
最后阐述了pointfree的概念，并通过curry，compose，以及data goes last原则写出了一个pointfree风格的代码。

