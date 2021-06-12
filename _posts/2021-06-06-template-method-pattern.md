---
title: "Template Method Design Pattern"
categories:
  - Design-Patterns
tags:
  - design-pattern
  - template-method-pattern
  - behavioral-design-pattern
  - clean-code
---

![template-method-cover](../../../assets/img/blog/templatemethodpattern/templatemethodcover.png)

`Template Method` Design Pattern একধরনের behavioral design pattern যা একই ধরনের অ্যালগোরিদম এর জন্য একটা স্কেলেটন provide করে যার ফলশ্রুতিতে code duplicacy অনেক কমানো যায়।

According to the book `Design Patterns: Elements of Reusable Object-Oriented Software (Gang of Four)` Template Method Pattern is used to -

> "Define the skeleton of an algorithm in an operation, deferring some steps to subclasses. Template Method lets subclasses redefine certain steps of an algorithm without changing the algorithm’s structure.”

একটা প্রবলেম দিয়ে শুরু করি।

![template-method-problem](../../../assets/img/blog/templatemethodpattern/templatemethodpizza.jpeg)

### Problem Definition

ধরে নিন, আমাদের একটি `Pizza Maker` বানাতে হবে যার সাহায্যে বিভিন্ন ধরনের Pizza তৈরি করা যাবে। Pizza তৈরি করার কিছু নির্দিষ্ট স্টেপ আছে। যেমন-

- Prepare Pizza Dough
- Bake Crust
- Prepare Ingredients
- Add Toppings
- Add Extra Sauce
- Bake Pizza
- Pack Pizza

এখানে, `Add Extra Sauce` এবং `Pack Pizza` user এর উপর ডিপেন্ড করবে। যদি user takeaway চায় তাহলে pack pizza step execute করতে হবে, একইভাবে extra sauce add করতে চাইলে `Add Extra Sauce` step টি execute করতে হবে।

চলুন এবার কয়েকটি solution নিয়ে কথা বলি।

### Solution 1

আমরা যে ধরনের Pizza বানাতে চাই, সে ধরনের একটি class তৈরি করব প্রতিবার। যেমন ধরুন, আমরা যদি `Chicken Mushroom Pizza` বানাতে চাই, তাহলে কোড কিছুটা এমন হবে।

```java
public class ChickenMushroomPizza {
    public void prepareDough() {
        System.out.println("Preparing Pizza Dough!");
    }
    public void bakeCrust() {
        System.out.println("Baking Crust!");
    }
    public void prepareIngredients() {
        System.out.println("Preparing Ingredients!! Chicken & Mushroom");
    }
    public void addToppings() {
        System.out.println("Adding Toppings - Olive, Sausage!");
    }
    public void extraSauce() {
        System.out.println("Adding Extra Sauce!");
    }
    public void bakePizza() {
        System.out.println("Baking Pizza!");
    }
    public void packPizza() {
        System.out.println("Packing Pizza!");
    }
}
```

ক্লায়েন্ট সাইডের ক্লাস থেকে এই ক্লাসটির একটি অবজেক্ট তৈরি করে pizza making এর সবগুলা স্টেপ execute করব।

```java
public class PizzaMaker {
    public static void main(String ...args) {
        private boolean isExtraSauce = true;
        private boolean isPackPizza = false;
        ChickenMushroomPizza chickenMushroomPizza = new ChickenMushroomPizza();
        // execute all steps
        chickenMushroomPizza.prepareDough();
        chickenMushroomPizza.bakeCrust();
        chickenMushroomPizza.prepareIngredients();
        chickenMushroomPizza.addToppings();
        if (isExtraSauce) {
            chickenMushroomPizza.addExtraSauce();
        }
        chickenMushroomPizza.bakePizza();
        if (isPackPizza) {
            chickenMushroomPizza.packPizza();
        }
    }
}
```

এই solution এর সবচেয়ে কুৎসিত ব্যাপারটা হলো, PizzaMaker class এর মধ্যে steps গুলা call করা। আমরা প্রতিটা ক্লাসের মধ্যেই এই স্টেপগুলা add করে দিতে পারি। তাহলে solution টা আরেকটু better হবে।

```java
public class ChickenMushroomPizza {
    public void makePizza() {
        prepareDough();
        bakeCrust();
        prepareIngredients();
        addToppings();
        if (isExtraSauce()) {
            addExtraSauce();
        }
        bakePizza();
        if (isPackPizza()) {
            packPizza();
        }
    }
    public void prepareDough() {
        System.out.println("Preparing Pizza Dough!");
    }
    public void bakeCrust() {
        System.out.println("Baking Crust!");
    }
    public void prepareIngredients() {
        System.out.println("Preparing Ingredients!! Chicken & Mushroom");
    }
    public void addToppings() {
        System.out.println("Adding Toppings - Olive, Sausage!");
    }
    public void extraSauce() {
        System.out.println("Adding Extra Sauce!");
    }
    public void bakePizza() {
        System.out.println("Baking Pizza!");
    }
    public void packPizza() {
        System.out.println("Packing Pizza!");
    }

    public boolean isPackPizza() {
        return true;
    }
    public boolean isExtraSauce() {
        return true;
    }
}
```

এখন আমরা শুধু PizzaMaker class থেকে makePizza method টা-কে call করে দিব।

```java
public class PizzaMaker {
    public static void main(String ...args) {
        ChickenMushroomPizza chickenMushroomPizza = new ChickenMushroomPizza();
        chickenMushroomPizza.makePizza();
    }
}
```

এখন কোডটা একটু ক্লিন মনে হচ্ছে। আচ্ছা, এখন যদি আমরা আরেকধরনের pizza তৈরি করতে চাই, তাহলে কি করতে হবে?
আমাদের আরেকটা ক্লাস লিখতে হবে। চলুন লিখে ফেলা যাক।

```java
public class MushroomPizza {
    public void makePizza() {
        prepareDough();
        bakeCrust();
        prepareIngredients();
        addToppings();
        if (isExtraSauce()) {
            addExtraSauce();
        }
        bakePizza();
        if (isPackPizza()) {
            packPizza();
        }
    }
    public void prepareDough() {
        System.out.println("Preparing Pizza Dough!");
    }
    public void bakeCrust() {
        System.out.println("Baking Crust!");
    }
    public void prepareIngredients() {
        System.out.println("Preparing Ingredients!! Mushroom");
    }
    public void addToppings() {
        System.out.println("Adding Toppings - Olive!");
    }
    public void extraSauce() {
        System.out.println("Adding Extra Sauce!");
    }
    public void bakePizza() {
        System.out.println("Baking Pizza!");
    }
    public void packPizza() {
        System.out.println("Packing Pizza!");
    }

    public boolean isPackPizza() {
        return true;
    }
    public boolean isExtraSauce() {
        return true;
    }
}
```

এবার যদি একটু খেয়াল করি, আমরা কিন্তু অনেক duplicate code দেখতে পারব। দুইটা ক্লাসের prepareIngredients() এবং addToppings() method ছাড়া বাকি সব মেথড কিন্তু দুইটাতেই একই, কোন ধরনের চেঞ্জ নাই। এখন যদি কোন একটা কমন মেথডে চেঞ্জ করা লাগে, তাহলে কিন্তু সবগুলার ক্লাসের এই মেথড চেঞ্জ করা লাগবে, কারণ মেথডগুলা ডুপ্লিকেট।

অর্থ্যাৎ, যদি bakePizza() method এ কিছু চেঞ্জ করা লাগে, তাহলে ChickenMushroomPizza এবং MushroomPizza দুইটা ক্লাসের bakePizza() method কেই চেঞ্জ করা লাগবে, যেটা খুবই inconvenient একটা ব্যাপার।

এই প্রব্লেমটাই আমরা template method pattern দিয়ে সলভ করার চেষ্টা করব।

### Solution 2

শুরুতে `Pizza` নামে একটা abstract class তৈরি করে নেয়া যাক। Pizza class এ কমন মেথডগুলা আমরা implement করে রাখব এবং যে মেথডগুলো class ভেদে পরিবর্তন হবে সেগুলোকে abstract method হিসেবে রেখে দিবো, যাতে পরবর্তীতে এর subclass মেথডগুলোকে নিজেদের মতো করে Override করে নিতে পারে।

```java
public abstract class Pizza {
    public void makePizza() {
        prepareDough();
        bakeCrust();
        prepareIngredients();
        addToppings();
        if (isExtraSauce()) {
            extraSauce();
        }
        bakePizza();
        if (isPackPizza()) {
            packPizza();
        }
    }
    void prepareDough() {
        System.out.println("Preparing Pizza Dough!");
    }
    void bakeCrust() {
        System.out.println("Baking Crust!");
    }
    abstract void prepareIngredients();
    abstract void addToppings();

    void extraSauce() {
        System.out.println("Adding Extra Sauce!");
    }
    void bakePizza() {
        System.out.println("Baking Pizza!");
    }
    void packPizza() {
        System.out.println("Packing Pizza!");
    }

    boolean isPackPizza() {
        return false;
    }
    boolean isExtraSauce() {
        return false;
    }
}
```

আমাদের এই ক্লাসে শুধু দুইটা abstract method আছে, যে মেথডগুলা ক্লাসভেদে চেঞ্জ হবে।

```java
public class ChickenMushroomPizza extends Pizza {
    @Override
    public void prepareIngredients() {
        System.out.println("Preparing Ingredients!! Chicken & Mushroom");
    }
    @Override
    public void addToppings() {
        System.out.println("Adding Toppings - Olive, Sausage!");
    }

    public boolean isExtraSauce() {
        return true;
    }
    public boolean isPackPizza() {
        return true;
    }
}
```

```java
public class MushroomPizza extends Pizza {
    @Override
    public void prepareIngredients() {
        System.out.println("Preparing Ingredients!! Mushroom");
    }
    @Override
    public void addToppings() {
        System.out.println("Adding Toppings - Olive");
    }
    public boolean isExtraSauce() {
        String answer = null;
        System.out.println("Would you like to add extra sauce (yes/no)?");

        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        try {
            answer = in.readLine();
        } catch(IOException e) {
            System.err.println("IO error trying to read your answer");
        }
        if (answer == null || answer.equals("no")) {
            return false;
        }
        return true;
    }
    public boolean isPackPizza() {
        return true;
    }
}
```

Duplicate code কিন্তু এখন একদমই নেই আমাদের এই solution এ। এখন যদি কমন মেথডে কোন চেঞ্জ করা লাগে তাহলে Pizza class এর মেথডে চেঞ্জ করলেই হয়ে যাচ্ছে।

যদি ChickenMushroomPizza এবং MushroomPizza class এর isExtraSauce ও isPackPizza মেথডটার দিকে খেয়াল করি, তাহলে দেখতে পাবো, আমরা কিন্তু নিজেদের মতো করে একটা মেথড চেঞ্জ করে নিতে পারছি, যে মেথডটার তার প্যারেন্ট ক্লাসে কোন কাজ ছিল না, জাস্ট একটা ডিফল্ট implementation দেয়া ছিল। এই মেথডগুলাকে বলা হয় `Hooks`।

`Hooks` মেথডগুলা লিখা হয় যাতে করে child class -এ নিজেদের মতো implementation লিখা যায়, আর যদি না লিখা হয় তাহলে সে তার প্যারেন্ট ক্লাসের implementation কেই ব্যবহার করে থাকে।

একইভাবে makePizza method টা-কে বলে হয় template method।

যদি UML Diagram দিয়ে পুরো ফ্লো-টা দেখার চেষ্টা করি।
![template-method-uml](../../../assets/img/blog/templatemethodpattern/templatemethoduml.png)

Template Method implement করার সময় একটা জিনিস মনে রাখতে হবে যে, concrete class গুলো কখনই templateMethod মেথডটাকে override করবে না।

অর্থ্যাৎ, আমাদের ক্ষেত্রে ChickenMushroomPizza এবং MushroomPizza কখনই makePizza method কে override করবে না।

সবসময় সবকিছুতে এই ডিজাইন প্যাটার্ন এপ্লাই করা যাবে না, use case বুঝে ব্যবহার করতে হবে। একই ধরনের অ্যাালগোদিরম এর স্কেলেটন তৈরি করে কোড ডুপ্লিকেসি কমানোর জন্য এই ডিজাইন প্যাটার্ন ব্যবহার করা হয়। তাই অ্যালগোরিদমে ভিন্নতা আছে এমন কোন প্রবলেমের জন্য এই ডিজাইন প্যাটার্ন হয়ত suitable হবে না এবং সেক্ষেত্রে সেটি `Liskov Substitution Principle (LSP)` violate করতে পারে।

Full Implementation Link - [Github](https://github.com/simantaturja/Design-Patterns-Implementation/tree/master/TemplateMethodPatternJavaImplementation)

#### Additional Resources:

1. https://refactoring.guru/design-patterns/template-method
2. https://springframework.guru/gang-of-four-design-patterns/template-method-pattern/

Liskov Substitution Principle এবং SOLID Principles নিয়ে পড়ালেখা করতে চাইলে - [https://medium.com/backticks-tildes/the-s-o-l-i-d-principles-in-pictures-b34ce2f1e898](https://medium.com/backticks-tildes/the-s-o-l-i-d-principles-in-pictures-b34ce2f1e898)
