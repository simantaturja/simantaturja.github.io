---
title: "Decorator Design Pattern"
categories:
  - Design-Patterns
tags:
  - design-pattern
  - decorator-pattern
  - structural-pattern
  - clean-code
---

`Decorator Pattern` একধরনের `structural design pattern` যা ব্যবহার করে runtime এ কোন object-এ dynamically behaviour add করা যায়।

According to the book "Design Patterns: Elements of Reusable Object-Oriented Software", Decorator pattern is defined as -

> “Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.”

### Problem Definition

একটি Coffee Shop ডিজাইন করতে হবে। Coffee Shop এ দুইধরনের Beverage serve করা হবে, চা আর কফি। চা এবং কফির সাথে বিভিন্ন ধরনের condiment বা addon যোগ করে customize করে নেয়া যাবে।

চা বলতে এখানে রং চা / লাল চা এবং কফি বলতে espresso বুঝানো হয়েছে। কেউ চাইলে রং চা বা espresso নিতে পারবে অথবা এর সাথে মিল্ক, সুগার, চকোলেট যোগ করে ইচ্ছামত customize করেও নেয়া যাবে।

অর্থ্যাৎ, base beverage আছে দুইটা, চা এবং কফি। condiments বা addon's আছে ৪টি অথবা তার বেশি।

এই প্রবলেম অনুযায়ী আমরা শুধু চার ধরনের condiments বা addon নিয়ে কথা বলব, মিল্ক, সুগার, চকোলেট এবং আইস (ice)।

ডিজাইনটা এমনভাবে করতে হবে যাতে ভবিষ্যতে নতুন কোন addon যোগ করলে ডিজাইন চেঞ্জ করতে না হয়। existing ডিজাইনকে extend করেই যাতে কাজ করা যায়।

![decorator-pattern-problem-definition](../../../assets/img/blog/decoratorpattern/problem-definition.png)

### Solution 1

সবচেয়ে naive solution টা এমন হতে পারে, all possible classes create করা। যেমনঃ `Tea, TeaWithMilk, TeaWithMilkandSugar, TeaWithMilkSugarAndIce, CoffeeWithMilk`, এইরকমভাবে চলতেই থাকবে।

এই solution টা নিয়ে যদি একটু চিন্তা করি, তাহলে বুঝতে পারব, যদি condiments বা beverage এর পরিমাণ বাড়ে তাহলে অনেক বেশি পরিমাণ class হয়ে যাবে, যাকে আমরা `class explosion` বলতে পারি।

![class-explosion](../../../assets/img/blog/decoratorpattern/class-explosion.png)

### Solution 2

এই ডিজাইনে দুইটা base beverage class থাকবে, একটা চা এবং একটা কফির জন্য।

```java
public class Tea {
    private boolean milk;
    private boolean sugar;
    private boolean ice;
    private boolean chocolate;

    private double milkPrice = 10.00;
    private double sugarPrice = 12.00;
    private double icePrice = 5.00;
    private double chocolatePrice = 20.00;

    public boolean hasMilk() {
        return this.milk;
    }
    public boolean hasSugar() {
        return this.sugar;
    }
    public boolean hasIce() {
        return this.ice;
    }
    public boolean hasCholocate() {
        return this.chocolate;
    }

    // Setters for Addons
    public void setMilk(boolean milk) {
        this.milk = milk;
    }
    public void setSugar(boolean sugar) {
        this.sugar = sugar;
    }
    public void setIce(boolean ice) {
        this.ice = ice;
    }
    public void setChocolate(boolean chocolate) {
        this.chocolate = chocolate;
    }

    public double cost() {
        double totalPrice = 0.0;
        if (hasMilk()) totalPrice += this.milkPrice;
        if (hasSugar()) totalPrice += this.sugarPrice;
        if (hasIce()) totalPrice += this.icePrice;
        if (hasChocolate()) totalPrice += this.chocolatePrice;
    }
}
```

Coffee ক্লাসটাও একইভাবে লিখতে হবে। দেখেই বুঝতে পারছেন, এই ডিজাইনের সমস্যা কোথায়। `Tea class` এর জন্য যা যা লিখতে হয়েছে সেটারই একটা duplicate কপি আমাদের `Coffee class` এর জন্যও লিখতে হবে। যদি ভবিষ্যতে অন্য কোন ধরনের beverage add করতে চাই, তাহলে ঐ beverage class এর জন্য আবারো একই কোড duplicate করতে হবে।

এই solution টা improve করার আগে `client side` থেকে কিভাবে `Tea class` টা-কে call করা হচ্ছে সেটা দেখে নেয়া যাক।

```java
public class CoffeeShop {
    public static void main(String[] args) {
        Tea tea = new Tea();
        tea.setMilk(true);
        tea.setSugar(false);
        tea.setIce(true);
        tea.setChocolate(true);
        System.out.println("Total Price of the Tea: " + tea.cost());

        // একই ভাবে Coffee এর জন্য লিখা যাবে

        Coffee coffee = new Coffee();
        coffee.setMilk(true);
        coffee.setSugar(true);
        coffee.setIce(true);
        coffee.setChocolate(false);
        System.out.println("Total Price of the Coffee: " + coffee.cost());
    }
}
```

এখন একটু improved solution নিয়ে কথা বলা যাক। `code duplicacy` এর ব্যপারটা একটা `Base class` দিয়ে solve করা যেতে পারে। যে base class -কে পরবর্তীতে Tea এবং Coffee class extend করে কাজ করবে।

```java
public abstract class Beverage {
    private boolean milk;
    private boolean sugar;
    private boolean ice;
    private boolean chocolate;

    private double milkPrice = 10.00;
    private double sugarPrice = 12.00;
    private double icePrice = 5.00;
    private double chocolatePrice = 20.00;

    public boolean hasMilk() {
        return this.milk;
    }
    public boolean hasSugar() {
        return this.sugar;
    }
    public boolean hasIce() {
        return this.ice;
    }
    public boolean hasChocolate() {
        return this.chocolate;
    }

    // Setters for Addons
    public void setMilk(boolean milk) {
        this.milk = milk;
    }
    public void setSugar(boolean sugar) {
        this.sugar = sugar;
    }
    public void setIce(boolean ice) {
        this.ice = ice;
    }
    public void setChocolate(boolean chocolate) {
        this.chocolate = chocolate;
    }

    public double getMilkPrice() {
        return this.milkPrice;
    }
    public double getSugarPrice() {
        return this.sugarPrice;
    }
    public double getIcePrice() {
        return this.icePrice;
    }
    public double getChocolatePrice() {
        return this.chocolatePrice;
    }

    public abstract double cost();
}
```

এবার এই class টা কে Tea এবং Coffee extend করে কাজ করবে।

```java
public class Tea extends Beverage {
    @Override
    public double cost() {
        double totalPrice = 0.0;
        if (hasMilk()) totalPrice += getMilkPrice();
        if (hasSugar()) totalPrice += getSugarPrice();
        if (hasIce()) totalPrice += getIcePrice();
        if (hasChocolate()) totalPrice += getChocolatePrice();
        return totalPrice;
    }
}
```

এবার ধরুন, আমাদের কাছে কিছুটা এইরকম অর্ডার এসেছে।

> Coffee with one milk, one sugar, double chocolate and double ice

আমাদের existing solution-এ শুধুমাত্র একইধরনের একটা addon-ই যোগ করা যায়। অর্থ্যাৎ, আমরা চাইলেও existing solution ব্যবহার করে double chocolate এবং double ice দিতে পারব না। এটা কিন্তু এই solution এর বেশ বড় একটা drawback।

এছাড়াও আরো কিছু প্রবলেম আছে। যদি কোন addon যোগ করা লাগে, সেক্ষেত্রে আমাদের true pass করতে হচ্ছে এবং যোগ না করলে false pass করতে হচ্ছে argument এ। যোগ করার ক্ষেত্রে true pass করাটা হয়তো ঠিক আছে, কিন্তু কিছু যোগ না করলেও সেটার false value pass করাটা ভালো ডিজাইনের মধ্যে পড়ে না।

### Solution 3 (Decorator Pattern Solution)

এবার আমরা wrapper based একটা solution লিখার চেষ্টা করব। আইডিয়াটা হলো এমন- base beverage আছে Tea এবং Coffee। আমাদের যদি ডাবল চকলেট দরকার হয় তাহলে আমরা চকোলেট wrapper দিয়ে দুইবার wrap করব। একবার দরকার হলে একবার।

![wrapper-based-solution](../../../assets/img/blog/decoratorpattern/wrapper.png)

solution টা step by step build করার চেষ্টা করব।

প্রথমেই Beverage নামে একটা interface লিখে ফেলব, যা পরবর্তীতে Tea এবং Coffee class implement করবে।

`Beverage.java`

```java
public interface Beverage {
    public String details();
    public double cost();
}
```

`Coffee.java`

```java
public class Coffee implements Beverage {
    @Override
    public String details() {
        return "Coffee";
    }
    @Override
    public double cost() {
        return 100.00;
    }
}
```

`Tea.java`

```java
public class Tea {
    @Override
    public String details() {
        return "Tea";
    }
    @Override
    public double cost() {
        return 50.00;
    }
}
```

```java
public class Condiments implements Beverage {
    Beverage beverage;
    public Condiments(Beverage beverage) {
        this.beverage = beverage;
    }
    public String details() {
        return beverage.details();
    }
    public double cost() {
        return beverage.cost();
    }
}
```

```java
public class Chocolate extends Condiments {
    private double chocolateCost = 20.00;
    public Chocolate(Beverage beverage) {
        super(beverage);
    }
    public String details() {
        return beverage.details() + " + Chocolate";
    }
    public double cost() {
        return beverage.cost() + chocolateCost;
    }
}
```

একইভাবে Milk, Sugar এবং Ice এর জন্য class লিখতে হবে।

এবার যদি client side থেকে calling টা দেখি-

আমাদের অর্ডার হচ্ছে- `Coffee with one sugar, one milk, double chocolate and double ice`.

```java
public class CoffeeShop {
    public static void main(String[] args) {
        Beverage coffee = new Coffee(); // base coffee
        coffee = new Sugar(coffee); // wrap with one sugar
        coffee = new Milk(coffee); // wrap with one milk
        coffee = new Chocolate(new Chocolate(coffee)); // wrap with double chocolate
        coffee = new Ice(new Ice(coffee)); //wrap with double ice

        //যদি এক লাইনে লিখতাম -
        Beverage coffee2 = new Ice(new Ice(new Chocolate(new Chocolate(new Milk(new Sugar(new Coffee()))))));
    }
}
```

এখানে হয়তো একটা cost calculation এর ব্যাপারে confusion তৈরি হতে পারে। আমরা একটা ছবির সাহায্যে দেখি কিভাবে আসলে cost টা calculate হচ্ছে।

![wrapper-cost-recursive](../../../assets/img/blog/decoratorpattern/wrapper-cost.png)

উপরের ছবি থেকেই আমরা বুঝতে পারছি ব্যাপারটা রিকার্শনের মতো। সবচেয়ে বাইরের wrapper টা তার ভেতরের wrapper বা `parent wrapper` এর cost কে call করবে, এইভাবে যখন `Coffee class` এর `cost` method টা call হবে, সে একটা ভ্যালু রিটার্ন করবে, তার পরবর্তী ধাপগুলোতে প্রতিটা condiments এর cost যোগ হবে। সবশেষ ধাপে আমরা total cost টা পাবো।

এই solution এর সাহায্যে আমরা উপরের সব কয়টা প্রবলেমই সলভ করতে পেরেছি। এখন যদি আমাদের নতুন কোন beverage বা condiment নতুনভাবে সিস্টেমে add করা লাগে, সেক্ষেত্রেও কিন্তু আমাদের এই ডিজাইনটা ঠিক থাকবে, এই ডিজাইনকে easily extend করে কাজ করা যাবে।

আমরা এতক্ষণ `Decorator Pattern` এর যে solution টা নিয়ে কথা বললাম, সেটাকে যদি UML Diagram দিয়ে visualize করার চেষ্টা করি, তাহলে এমন দেখাবে।

![uml-decorator-pattern](../../../assets/img/blog/decoratorpattern/uml.png)

Full Implementation Link - [Github](https://github.com/simantaturja/Design-Patterns-Implementation/tree/master/DecoratorPatternJavaImplementation)

Additional Resources for Reading:

1. Spring Framework Guru - GoF Design Pattern - [Decorator Pattern](https://springframework.guru/gang-of-four-design-patterns/decorator-pattern/)
2. Refactoring Guru - [Decorator Pattern](https://refactoring.guru/design-patterns/builder)
