---
title: 'Iterator Design Pattern'
categories:
  - Design-Patterns
tags:
  - design-pattern
  - iterator-pattern
  - behavioral-design-pattern
  - clean-code
---

![iterator](../../../assets/img/blog/iteratorpattern/Iterator.png)

ইটারেটর ডিজাইন প্যাটার্ন এক ধরনের `behavioural design pattern` যার সাহায্যে ভিন্ন ধরনের অবজেক্ট একইভাবে ইটারেট করার সুবিধা পাওয়া যায়।
According to the book `Design Patterns: Elements of Reusable Object-Oriented Software`, Iterator Pattern is used to -

> Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.

### Problem Definition

ধরুন, আপনার কাছে দুই ধরনের ডেটা স্ট্রাকচার আছে, অ্যারে এবং এ্যারে লিস্ট। এই দুইটা Data Structure এ ইটারেট করার ধরণ কিন্তু আলাদা।

```java
    public class Main {
        public static void main(String[] args) {
            ArrayList <Integer> arrayList = new ArrayList<>();
            int[] list = new int[10];

            // way of traversing the array list
            for (int i = 0; i < arrayList.size(); ++i) {
                int item = arrayList.get(i);
                System.out.println("Item " + i + 1 + "in Array List: " + item);
            }

            // way of traversing the array
            for (int i = 0; i < list.length; ++i) {
                int item = list[i];
                System.out.println("Item " + i + 1 + "in Array: " + item);
            }
        }
    }
```

এখন প্রশ্ন হচ্ছে, এইখানে সমস্যা কোথায়?
আগে একটা প্রবলেম ডিফাইন করে নেয়া যাক।

দুই ধরনের মেনু কার্ড আছে, BreakfastMenu আর LunchMenu। এই দুইটা ক্লাসই ইমপ্লিমেন্ট করা আছে, BreakfastMenu ক্লাসের ভেতরে এর মেনুটা `Array List` দিয়ে ইমপ্লিমেন্ট করা আছে, LunchMenu এর মেনু `Array` দিয়ে implement করা আছে।
এখন যদি আপনাকে ক্লায়েন্ট সাইড থেকে দুইটার লিস্টই প্রিন্ট করতে হয়, তাহলে কিভাবে করবেন?

```java
public class Menu {
    public static void main(String[] args) {
        BreakfastMenu breakfastMenu = new BreakfastMenu();
        LunchMenu lunchMenu = new LunchMenu();

        ArrayList <MenuItem> breakfastMenuList = breakfastMenu.getMenuItems();
        MenuItem[] lunchMenuList = lunchMenu.getMenuItems();

        for (int i = 0; i < breakfastMenuList.size(); ++i) {
            MenuItem item = breakfastMenuList.get(i);
            System.out.println("Item " + i + 1 + "in Array List of BreakfastMenu: " + item.getName());
        }

        for (int i = 0; i < lunchMenuList.length; ++i) {
            MenuItem item = lunchMenuList[i];
            System.out.println("Item " + i + 1 + "in Array of LunchMenu: " + item.getName());
        }
    }
}
```

কি মনে হচ্ছে? একটু inconvenient হয়ে গেলো না? ক্লায়েন্টকে প্রতিবার আলাদাভাবে মনে রাখতে হচ্ছে কিভাবে একটা ভিন্নধরনের স্ট্রাকচারকে ইটারেট করতে হয়। এর চেয়ে যদি এমন করা যেতো যে, একইভাবে প্রত্যেকটা স্ট্রাকচারকে ইটারেট করা যাবে, তাহলে কেমন হতো?

### Solution 1

প্রবলেম ডেফিনেশনে যে দুইটা ক্লাসের কথা উল্লেখ করেছি, ঐ দুইটা ক্লাসের implementation আগে দেখে দেয়া যাক।

```java
public class MenuItem {
	String name;
	String description;
	double price;

	public MenuItem(String name,
	                String description,
	                double price)
	{
		this.name = name;
		this.description = description;
		this.price = price;
	}

	public String getName() {
		return name;
	}

	public String getDescription() {
		return description;
	}

	public double getPrice() {
		return price;
	}
}
```

```java
import java.util.ArrayList;
import java.util.Iterator;

public class BreakfastMenu {
	ArrayList<MenuItem> menuItems;

	public BreakfastMenu() {
		menuItems = new ArrayList<MenuItem>();

		addItem("K&B's Pancake Breakfast",
			"Pancakes with scrambled eggs and toast",
			2.99);

		addItem("Regular Pancake Breakfast",
			"Pancakes with fried eggs, sausage",
			2.99);

		addItem("Blueberry Pancakes",
			"Pancakes made with fresh blueberries and blueberry syrup",
			3.49);

		addItem("Waffles",
			"Waffles with your choice of blueberries or strawberries",
			3.59);
	}

	public void addItem(String name, String description, double price)
	{
		MenuItem menuItem = new MenuItem(name, description, price);
		menuItems.add(menuItem);
	}

	public ArrayList<MenuItem> getMenuItems() {
		return menuItems;
	}
}
```

```java
import java.util.Iterator;

public class LunchMenu {
	static final int MAX_ITEMS = 6;
	int numberOfItems = 0;
	MenuItem[] menuItems;

	public DinerMenu() {
		menuItems = new MenuItem[MAX_ITEMS];

		addItem("Vegetarian BLT",
			"(Fakin') Bacon with lettuce & tomato on whole wheat", 2.99);
		addItem("BLT",
			"Bacon with lettuce & tomato on whole wheat", 2.99);
		addItem("Soup of the day",
			"Soup of the day, with a side of potato salad", 3.29);
		addItem("Hotdog",
			"A hot dog, with sauerkraut, relish, onions, topped with cheese", 3.05);
		addItem("Steamed Veggies and Brown Rice",
			"A medly of steamed vegetables over brown rice", 3.99);
		addItem("Pasta",
			"Spaghetti with Marinara Sauce, and a slice of sourdough bread", 3.89);
	}

	public void addItem(String name, String description, double price)
	{
		MenuItem menuItem = new MenuItem(name, description, price);
		if (numberOfItems >= MAX_ITEMS) {
			System.err.println("Sorry, menu is full!  Can't add item to menu");
		} else {
			menuItems[numberOfItems] = menuItem;
			numberOfItems = numberOfItems + 1;
		}
	}

	public MenuItem[] getMenuItems() {
		return menuItems;
	}
}
```

একটা solution এমন হতে পারে, `BreakfastMenu` ক্লাসে নতুন একটা মেথড যোগ করা এবং সে মেথডের কাজ হবে `ArrayList` কে `Array`-তে কনভার্ট করা। তাহলেই কিন্তু একইভাবে দুইটা স্ট্রাকচারকে ইটারেট করা যাবে।

```java
import java.util.ArrayList;
import java.util.Iterator;

public class BreakfastMenu {
	ArrayList<MenuItem> menuItems;

	public BreakfastMenu() {
		menuItems = new ArrayList<MenuItem>();

		addItem("K&B's Pancake Breakfast",
			"Pancakes with scrambled eggs and toast",
			2.99);

		addItem("Regular Pancake Breakfast",
			"Pancakes with fried eggs, sausage",
			2.99);

		addItem("Blueberry Pancakes",
			"Pancakes made with fresh blueberries and blueberry syrup",
			3.49);

		addItem("Waffles",
			"Waffles with your choice of blueberries or strawberries",
			3.59);
	}

	public void addItem(String name, String description, double price)
	{
		MenuItem menuItem = new MenuItem(name, description, price);
		menuItems.add(menuItem);
	}

	public MenuItem[] getMenuItems() {
		return getArrayFromArrayList(menuItems);
	}
    public MenuItem[] getArrayFromArrayList() {
        MenuItem[] menuItemArray = new MenuItem[menuItems.size()+1];
        for (int i = 0; i < menuItems.size(); ++i) {
            menuItemArray[i] = menuItems.get(i);
        }
        return menuItemArray;
    }
}
```

ক্লায়েন্ট ক্লাসটা যদি এবার একটু খেয়াল করি-

```java
    public class Menu {
        public static void main(String[] args) {
            BreakfastMenu breakfastMenu = new BreakfastMenu();
            LunchMenu lunchMenu = new LunchMenu();

            MenuItem[] breakfastMenuList = breakfastMenu.getMenuItems();
            MenuItem[] lunchMenuList = lunchMenu.getMenuItems();

            for (int i = 0; i < breakfastMenuList.length; ++i) {
                MenuItem item = breakfastMenuList[i]
                System.out.println("Item " + i + 1 + "in Array of BreakfastMenu: " + item.getName());
            }

            for (int i = 0; i < lunchMenuList.length; ++i) {
                MenuItem item = lunchMenuList[i];
                System.out.println("Item " + i + 1 + "in Array of LunchMenu: " + item.getName());
            }
        }
    }
```

আমরা কিন্তু দুইটা ভিন্ন ধরনের ডেটা স্ট্রাকচার একইভাবে ইটারেট করতে পারছি।

তবে এই ইমপ্লিমেন্টেশনে কিছু ঝামেলা আছে। আমরা existing class টাকেই খুব heavily modify করছি, যেটা সবসময় খুব ভালো একটা প্র্যাকটিস না। কারণ যত বেশি মডিফিকেশন তত বেশি bug introduce হওয়ার এবং existing class এর functionality break হওয়ার সম্ভাবনা বাড়ে। আমরা কী existing class-এ আরও মিনিমাল চেঞ্জ করে প্রবলেমটা সলভ করতে পারি?

![iterator-pattern](../../../assets/img/blog/iteratorpattern/iterator-mini-3x.png 'Source: Refactoring Guru')

### Solution 2

এই প্রবলেমটা এখন আমরা ইটারেটর প্যাটার্ন নিয়ে সলভ করার চেষ্টা করব। আগের solution এ আমরা যে কাজটা একটা মেথড দিয়ে করেছিলাম ইটারেটর প্যাটার্ন দিয়েও একই কাজ করব, তবে existing class কে যত কম মডিফাই করে করা যায়।

```java
public interface Iterator {
    boolean hasNext();
    MenuItem next();
}
```

প্রত্যেকটা ক্লাসকে একইভাবে ইটারেট করার জন্য আমরা প্রতিটা ক্লাসের জন্য একটা করে কনক্রিট ইন্টারেটর ক্লাস লিখব।

```java
public class LunchMenuIterator implements Iterator {
	MenuItem[] items;
	int position = 0;

	public LunchMenuIterator(MenuItem[] items) {
		this.items = items;
	}
    @Override
	public MenuItem next() {
		return items[position++];
	}
    @Override
	public boolean hasNext() {
		return items.length > position;
	}
}
```

```java
public class BreakfastMenuIterator implements Iterator {
	List<MenuItem> items;
	int position = 0;

	public BreakfastMenuIterator(List<MenuItem> items) {
		this.items = items;
	}
    @Override
	public MenuItem next() {
		return items.get(position++);
	}
    @Override
	public boolean hasNext() {
		return items.size() > position;
	}
}
```

দুইটা ক্লাসের জন্য দুইটা Iterator class বানানো শেষ। Iterator class এর hasNext() এর কাজ হলো, পরবর্তী item আছে কি না সেটা identify করা আর next() এর কাজ হলো, সেই element টাকে রিটার্ন করা।

আরেকটু ইজি করে বললে, hasNext() দিয়ে চেক করব, আর কোন element আছে কি না, আর যদি element থাকে, তাহলে সেই element টাকে next() method দিয়ে রিটার্ন করানো।

```java
import java.util.ArrayList;
import java.util.Iterator;

public class BreakfastMenu {
	ArrayList<MenuItem> menuItems;

	public BreakfastMenu() {
		menuItems = new ArrayList<MenuItem>();

		addItem("K&B's Pancake Breakfast",
			"Pancakes with scrambled eggs and toast",
			2.99);

		addItem("Regular Pancake Breakfast",
			"Pancakes with fried eggs, sausage",
			2.99);

		addItem("Blueberry Pancakes",
			"Pancakes made with fresh blueberries and blueberry syrup",
			3.49);

		addItem("Waffles",
			"Waffles with your choice of blueberries or strawberries",
			3.59);
	}

	public void addItem(String name, String description, double price)
	{
		MenuItem menuItem = new MenuItem(name, description, price);
		menuItems.add(menuItem);
	}

	public Iterator createIterator() {
		return new BreakfastMenuIterator(menuItems);
    }
}
```

আমাদের existing class এ শুধুমাত্র একটা iterator method এ্যাড করেছি। বাকি সব ইটারেশন এর কাজ আমরা Iterator class এর সাহায্যে করব, তাহলে আমাদের existing class এ তেমন মডিফাই করতে হচ্ছে না।

```java
public class IteratorPatternSolution {
    public static void main(String[] args) {
        BreakfastMenu breakfastMenu = new BreakfastMenu();
        LunchMenu lunchMenu = new LunchMenu();
        Iterator breakfastMenuIterator = breakfastMenu.createIterator();
        Iterator lunchMenuIterator = lunchMenu.createIterator();
        while (breakfastMenuIterator.hasNext()) {
            MenuItem menuItem = iterator.next();
			System.out.print(menuItem.getName() + ", ");
			System.out.print(menuItem.getPrice() + " -- ");
			System.out.println(menuItem.getDescription());
        }
        while (lunchMenuIterator.hasNext()) {
            MenuItem menuItem = iterator.next();
			System.out.print(menuItem.getName() + ", ");
			System.out.print(menuItem.getPrice() + " -- ");
			System.out.println(menuItem.getDescription());
        }
    }
}
```

ক্লায়েন্ট ক্লাস থেকে এখন দুইটা ক্লাসের লিস্টকেই কিন্তু একইভাবে ইটারেট করতে পারছি। এবং এই solution তা সময়মত easily extend ও করা যাবে। যদি নতুন কোন ধরনের ডেটা স্ট্রাকচারকে ইটারেট করা লাগে, তাহলে সেটার জন্য একইভাবে একটা ইটারেটর ক্লাস লিখে ফেলব।

প্রথম solution থেকে দ্বিতীয় solution ভালো হওয়ার একটা অন্যতম কারণ হচ্ছে, দ্বিতীয় solution single responsibility principle maintain করছে। প্রথম solution এর দিকে খেয়াল করলে দেখবেন, আমরা একই ক্লাস মডিফাই করে ওইটাতে ক্লাসের সব অন্যসব method এর সাথে iteration করার way ও বলে দিচ্ছিলাম। কিন্তু ইটারেশন করার ব্যাপারটা অন্য ক্লাসে রাখলে কোড ক্লিন থাকবে এবং existing class এ কম মডিফাই করতে হবে।

![uml-iterator-pattern](../../../assets/img/blog/iteratorpattern/iteratorpatternuml.png)

এখানে, Aggreate বলতে আসলে একটা ইন্টারফেস বুঝিয়েছে, যাকে পরবর্তীতে ConcreteAggregate ক্লাসগুলো implement করবে। আমরা solution এর simplicity রাখার জন্য Aggregate interface টাকে introduce করি নি। আমাদের প্রবলেমে ConcreteAggregate class গুলো হচ্ছে BreakfastMenu এবং LunchMenu। যদি আমরা Aggregate Interface introduce করতাম তাহলে `Menu` নামের একটা Aggregate Interface তৈরি করতে পারতাম।

```java
public interface Menu {
    public Iterator createIterator();
}
```

একটা জিনিস মনে রাখবেন,

> Coding to interface, not implementation.

Coding to interfaces is a technique to write classes based on an interface; interface that defines what the behavior of the object should be.

Details: [https://medium.com/javarevisited/oop-good-practices-coding-to-the-interface-baea84fd60d3#:~:text=Simple%3A%20%E2%80%9CCoding%20to%20interfaces%2C,actual%20class%20with%20the%20implementation.](https://medium.com/javarevisited/oop-good-practices-coding-to-the-interface-baea84fd60d3#:~:text=Simple%3A%20%E2%80%9CCoding%20to%20interfaces%2C,actual%20class%20with%20the%20implementation.)

Iterator Pattern নিয়ে আরো পড়ালেখা করতে চাইলে-
১। Refactoring Guru - [Iterator Pattern](https://refactoring.guru/design-patterns/iterator)
২। SpringFrameworkGuru - [Iterator Pattern](https://springframework.guru/gang-of-four-design-patterns/iterator-pattern/)
