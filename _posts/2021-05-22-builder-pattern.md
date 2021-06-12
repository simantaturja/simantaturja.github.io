---
title: "Builder Design Pattern"
categories:
  - Design-Patterns
tags:
  - design-pattern
  - builder-pattern
  - creational-design-pattern
  - clean-code
---

![builder-cover](../../../assets/img/blog/builderpattern/buildercover.png)

According to the book `Design Patterns: Elements of Reusable Object-Oriented Software (Gang of Four)` Builder Pattern is used to -

> “Separate the construction of a complex object from its representation so that the same construction process can create different representations.”

`Builder Pattern` একধরনের `Creational Design Pattern` যা complex object creation এর সময় ব্যবহার করা যেতে পারে।

`Builder pattern` সম্পর্কে খুব বিস্তারিত জানার আগে একটা প্রবলেম define করে নিতে চাই, যে প্রবলেম সলভ করার জন্য আমরা `Builder Pattern` apply করার চেষ্টা করব।

### Problem Definition

ধরে নিন, আপনার Desktop assemble বা build করার একটা দোকান আছে। আপনার দোকানে একটা ক্যাটালগ আছে, যা দেখে কেউ কাস্টম ডেস্কটপ পিসি বিল্ড করে নিতে পারবে।

তবে আপনার তৈরি করা Desktop PC এর একটা অন্যরকম বৈশিষ্ট্য আছে, তৈরি করা PC গুলো immutable হবে। অর্থ্যাৎ, PC build করার পর সেটাকে rebuild বা re-assemble করতে পারবেন না।

আমাদের প্রবলেম ডিফাইন করা হয়ে গেলো।

### Problem Requirements

উপরে বর্ণিত সিস্টেম বিল্ড করার জন্য কিছু শর্ত দিয়ে দেয়া আছে। যেমন-

1. সবার প্রথমে Casing setup করতে হবে।
2. Casing এর পর ওর মধ্যে Motherboard বসাতে হবে।
3. Motherboard বসানোর পর ওর মধ্যে processor এবং ram বসাতে হবে।

অর্থ্যাৎ, Casing বসানোর আগে Motherboard এবং Motherboard বসানোর আগে processor ও ram বসাতে পারব না। একটি particular order maintain করতে হবে।

উপরে বর্ণিত প্রবলেমের ক্ষেত্রে order টা হবে এমন-

1. Casing
2. Motherboard
3. Processor
4. Ram
5. PowerSupply
6. GraphicsCard (if applicable)
7. CpuCooler (if applicable)
8. SSD
9. HDD

PC Build করার components এর `Code snippet`-

```java
public enum Casing {
    ASUS_TUF_GAMING_TOWER,
    ASUS_ROG_MINI_D11,
    MAXGREEN_2809BK,
    MAXGREEN_2810BG_ATX,
    ANTEC_NX110_MID_TOWER_GAMING,
    CORSAIR_CARBIDE_SERIES_MID_TOWER_AT;
}

public enum Motherboard {
    GIGABYTE_GAF2A68HM_ULTRA_DURABLE_AMD,
    ASROCK_HM81M_ALOY,
    GIGABYTE_GA_H110M_DDR4,
    GIGABYTE_H310M_8TH_GEN,
    ASUS_PRIME_DDR3_MINI_ITX,
    MSI_H81M_INTEL_CHIPSET,
    GIGABYTE_H310M_DS2_8TH_GEN_MICRO_ATX,
    ASROCK_B365M_PRO4_9TH_GEN;
}
// ... rest of the components omitted
```

এবার প্রবলেম সলভ করার বিভিন্ন solution নিয়ে কথা বলা যাক।

### Solution 1 (Constructor Approach)

```java
public class DesktopTelescoping {
    private final Casing casing;
    private final CpuCooler cpuCooler;
    private final GraphicsCard graphicsCard;
    private final HDD hdd;
    private final Motherboard motherboard;
    private final PowerSupply powerSupply;
    private final Processor processor;
    private final Ram ram;
    private final SSD ssd;

    public DesktopTelescoping(Casing casing, CpuCooler cpuCooler,
                              GraphicsCard graphicsCard, HDD hdd,
                              Motherboard motherboard, PowerSupply powerSupply,
                              Processor processor, Ram ram, SSD ssd) {
        this.casing = casing;
        this.cpuCooler = cpuCooler;
        this.graphicsCard = graphicsCard;
        this.hdd = hdd;
        this.motherboard = motherboard;
        this.powerSupply = powerSupply;
        this.processor = processor;
        this.ram = ram;
        this.ssd = ssd;
    }
    public DesktopTelescoping(Casing casing, CpuCooler cpuCooler,
                              GraphicsCard graphicsCard, HDD hdd,
                              Motherboard motherboard, PowerSupply powerSupply,
                              Processor processor, Ram ram, SSD ssd, HDD hdd) {
        this(casing, cpuCooler, graphicsCard, hdd, motherboard, powersupply, processor, ram, ssd);
        this.hdd = hdd;
    }
    public void buildPC() {
       // .... building pc ....
       // ..... set casing ....
       // ..... set motherboard ....
       // ..... set processor ....
       // ..... set ram ....
    }
}

```

এই approach টি খুব সহজ একটি approach। একটি constructor এর সাহায্যে সবগুলো component নিয়ে নিচ্ছি। তারপর `buildPC` function এ PC build করে ফেলছি আমাদের পূর্বনির্ধারিত অর্ডারে।

ক্লায়েন্ট সাইড থেকে কিভাবে constructor টাকে কল করা হচ্ছে একটু দেখা যাক।

```java
public class RunnerTelescoping {
    public static void main(String... args) {
        DesktopTelescoping desktopTelescoping = new DesktopTelescoping(
                Casing.ANTEC_NX110_MID_TOWER_GAMING,
                CpuCooler.GAMDIAS_CHIONE_E2_120_LITE_RGB_LIQUID_CPU_COOLER,
                GraphicsCard.ASUS_GEFORCE_GT_710_2GB_DDR5,
                HDD.SEAGATE_1TB,
                Motherboard.ASROCK_B365M_PRO4_9TH_GEN,
                PowerSupply.ANTEC_ATOM_350W,
                Processor.AMD_RYZEN_9_5950X_PROCESSOR,
                Ram.CORSAIR_DOMINATOR_PLATINUM_RGB_16GB_4000MHz_DDR4,
                SSD.GIGABYTE_120GB
        );
        desktopTelescoping.buildPC();
    }
}

```

প্রবলেম ডেফিনেশনে যা বলে হয়েছিল তা আমরা ঠিকভাবে করতে পেরেছি। কিন্তু এই approach এ একটা সমস্যা আছে যাকে আমরা Telescoping Constructor বলে থাকি। `RunnerTelescoping` ক্লাস থেকে আমরা `DesktopTelescoping` এর constructor এ একটা নির্দিষ্ট অর্ডারে component গুলা pass করতে হয়েছে।

এত বড় constructor এ order মনে রাখা এবং একই সাথে কোন constructor use করব সেটা মনে রাখা একটা বিরাট ঝামেলার ব্যাপার। তাছাড়া যদি অদূর ভবিষ্যতে আমাদের আরও কিছু component constructor এ add করা লাগে, তাহলে constructor এর পরিমাণ এবং constructor এর সাইজ unmaintainable হয়ে যাবে।

তাহলে এই প্রবলেম এর solution কি হতে পারে?

### Solution 2 (Bean / Getter-Setter Approach)

`Telescoping constructor` থেকে মুক্তি পেতে `Beans` অথবা `setters` ব্যবহার করা যেতে পারে।
আগের solution এ components কে constructor এর সাহায্যে set করা হচ্ছিল, এই solution এ setters এর সাহায্যে set করা হচ্ছে।

```java
public class DesktopBean {
    private Casing casing;
    private CpuCooler cpuCooler;
    private GraphicsCard graphicsCard;
    private HDD hdd;
    private Motherboard motherboard;
    private PowerSupply powerSupply;
    private Processor processor;
    private Ram ram;
    private SSD ssd;

    public void setCasing(Casing casing) {
        this.casing = casing;
    }

    public void setCpuCooler(CpuCooler cpuCooler) {
        this.cpuCooler = cpuCooler;
    }

    public void setGraphicsCard(GraphicsCard graphicsCard) {
        this.graphicsCard = graphicsCard;
    }

    public void setHdd(HDD hdd) {
        this.hdd = hdd;
    }

    public void setMotherboard(Motherboard motherboard) {
        this.motherboard = motherboard;
    }

    public void setPowerSupply(PowerSupply powerSupply) {
        this.powerSupply = powerSupply;
    }

    public void setProcessor(Processor processor) {
        if (motherboard != null) {
            this.processor = processor;
        } else {
            System.out.println("Place motherboard first");
        }
    }

    public void setRam(Ram ram) {
        if (motherboard != null) {
            this.ram = ram;
        } else {
            System.out.println("Place motherboard first");
        }
    }

    public void setSsd(SSD ssd) {
        this.ssd = ssd;
    }

    public void buildPC() {
        // .... building pc ....
       // ..... set casing ....
       // ..... set motherboard ....
       // ..... set processor ....
       // ..... set ram ....
    }
}
```

আবার যদি আমরা client side টা observe করি।

```java
public class RunnerBean {
    public static void main(String... args) {
        DesktopBean desktopBean = new DesktopBean();
        desktopBean.setCasing(Casing.ANTEC_NX110_MID_TOWER_GAMING);
        desktopBean.setCpuCooler(CpuCooler.GAMDIAS_CHIONE_E2_120_LITE_RGB_LIQUID_CPU_COOLER);
        desktopBean.setGraphicsCard(GraphicsCard.ASUS_GEFORCE_GT_710_2GB_DDR5);
        desktopBean.setHdd(HDD.SEAGATE_1TB);
        desktopBean.setProcessor(Processor.AMD_RYZEN_9_5950X_PROCESSOR);
        desktopBean.setRam(Ram.CORSAIR_DOMINATOR_PLATINUM_RGB_16GB_4000MHz_DDR4);
        desktopBean.setMotherboard(Motherboard.GIGABYTE_GA_H110M_DDR4);
        desktopBean.setPowerSupply(PowerSupply.ANTEC_ATOM_350W);
        desktopBean.setSsd(SSD.GIGABYTE_120GB);

        desktopBean.buildPC();
    }
}
```

এভাবে Telescoping constructor এর প্রবলেম সলভ করে ফেলা যায়।

কিন্তু এই এপ্রোচেও কিছু প্রবলেম আছে। যেমন, এখানে component setup করার order মনে রাখতে হবে। যদি motherboard set করার আগে processor set করতে যাই, তাহলে error দিবে।

তাছাড়া, এটা Immutable Design হয় নি। একবার component সেট করার পর আবার `setter` method এর সাহায্যে component change করে ফেলা যাবে।

### Solution 3 (Builer Pattern)

এই solution এ আমরা `builder pattern` apply করে Solution 1 এবং Solution 2 এর `telescoping constructor এবং ordering problem` সলভ করার চেষ্টা করব।

`Builder pattern` এর কয়েকটা কম্পোনেন্ট আছে।

1. Builder
2. Director
3. Product

`Builder` এর কাজ হচ্ছে কোন একটা `product` build করা।

`Director` এর কাজ হচ্ছে Builder কে টেপ বাই স্টেপ instruction দিয়ে `product` build করানো।

`Product`- যা আমরা তৈরি করতে চাই, আমাদের ক্ষেত্রে `product` হলো `Desktop`।

যেহেতু অনেক ধরনের Desktop configuration থাকতে পারে, তাই আমরা প্রথমে একটা জেনেরিক Builder inteface তৈরি করব। যাকে ব্যবহার করে পরবর্তীতে concrete builder গুলা কাজ করবে।

```java
// Builder Interface
public interface Builder {
    void assembleCasing();
    void assembleMotherboard();
    void assembleProcessor();
    void assembleRam();
    void assembleGraphicsCard();
    void assemblePowerSupply();
    void assembleCpuCooler();
    void assembleSSD();
    void assembleHDD();
    Desktop getDesktop();
}
```

Desktop Build ক্যাটালগের একটি Gaming Desktop Configuration দেখি-

1. Casing - Antec NX110 Mid Tower Gaming Casing
2. MotherBoard - ASRock B365M 9th Gen
3. Processor - AMD Ryzen 9 5950X
4. Ram - Corsair Dominator 16gb DDR4
5. Graphics Card - Asus Tuf Gaming GeForce GTX 1650
6. Power Supply - Cooler Master Elite 400
7. Cooler - Gamdias Chione RGB CPU Cooler
8. SSD - Gigabye 1TB
9. HDD - Gigabyte 500GB

উপরের এই configuration অনুযায়ী আমরা একটি PC Build করার চেষ্টা করব। এই জন্য আমাদের একটি concrete builder ক্লাস লাগবে যার নাম দিচ্ছি GamingDesktop1Builder। এই concrete builder ক্লাসটি Builder interface কে implement করবে।

```java
public class GamingDesktop1Builder implements Builder {
    private final Desktop desktop;
    public GamingDesktop1Builder(Desktop desktop) {
        this.desktop = desktop;
    }
    @Override
    public Desktop getDesktop() {
        return desktop;
    }
    @Override
    public void assembleCasing() {
        this.desktop.setCasing(Casing.ANTEC_NX110_MID_TOWER_GAMING);
    }

    @Override
    public void assembleMotherboard() {
        this.desktop.setMotherboard(Motherboard.ASROCK_B365M_PRO4_9TH_GEN);
    }

    @Override
    public void assembleProcessor() {
        this.desktop.setProcessor(Processor.AMD_RYZEN_9_5950X_PROCESSOR);
    }

    @Override
    public void assembleRam() {
        this.desktop.setRam(Ram.CORSAIR_DOMINATOR_PLATINUM_RGB_16GB_4000MHz_DDR4);
    }

    @Override
    public void assembleGraphicsCard() {
        this.desktop.setGraphicsCard(GraphicsCard.ASUS_TUF_GAMING_GEFORCE_GTX_1650_SUPER_OC_4GB);
    }

    @Override
    public void assemblePowerSupply() {
        this.desktop.setPowerSupply(PowerSupply.COOLER_MASTER_ELITE_400_V4_230V);
    }

    @Override
    public void assembleCpuCooler() {
        this.desktop.setCpuCooler(CpuCooler.GAMDIAS_CHIONE_E2_120_LITE_RGB_LIQUID_CPU_COOLER);
    }

    @Override
    public void assembleSSD() {
        this.desktop.setSsd(SSD.GIGABYTE_AORUS_1TB_NVMe_GEN4_M2);
    }

    @Override
    public void assembleHDD() {
        this.desktop.setHdd(HDD.GIGABYTE_500GB);
    }
}
```

যে ধরনের PC Build করতে চাই, সে অনুযায়ী builder ক্লাস বানানো শেষ। এবার একটি Director ক্লাসের দরকার, যার কাজ হবে builder কে instruction প্রোভাইড করা যা ব্যবহার করে builder ক্লাস components দিয়ে GamingDesktop1 তৈরি করবে।

```java
package com.simantaturja.builder;

import com.simantaturja.components.*;

public class Director {
    private final DesktopBuilder builder;
    public Director(final DesktopBuilder builder) {
        this.builder = builder;
    }
    public void buildGamingDesktop() {
        builder.assembleCasing();
        builder.assembleMotherboard();
        builder.assembleProcessor();
        builder.assembleRam();
        builder.assemblePowerSupply();
        builder.assembleGraphicsCard();
        builder.assembleCpuCooler();
        builder.assembleSSD();
        builder.assembleHDD();
    }
    public Desktop getDesktop() {
        return builder.getDesktop();
    }
}

```

```java
public class BuilderPattern {
    public static void main(String[] args) {
        Director director = new Director(new DesktopBuilder(new Desktop()));
        director.buildGamingDesktop();
        Desktop desktop = director.getDesktop();
        System.out.println(desktop.display());
    }
}
```

এখন কিন্তু আমাদের অর্ডার নিয়ে আর চিন্তা করা লাগছে না। অর্ডার এর ব্যাপারটা `Director` ক্লাস হ্যান্ডেল করছে। এখন যদি অন্য কোন কনফিগারেশন এর পিসি বিল্ড করা লাগে তাহলে জাস্ট আমরা আরেকটা `concrete builder` তৈরি করব `GamingDesktop1Builder` ক্লাসের মতো করে।

আমরা এতক্ষণ `Builder Pattern` এর যে solution টা নিয়ে কথা বললাম, সেটাকে যদি UML Diagram দিয়ে visualize করার চেষ্টা করি, তাহলে এমন দেখাবে।
![uml-builder-pattern](../../../assets/img/blog/builderpattern/uml_builderpattern.png)

যদি পুরো ব্লগটার summary করার চেষ্টা করি -

১। `Builder Pattern` complex object construction এর জন্য ব্যবহার করা যেতে পারে এবং complex object এর complex construction process-কে একটা abstraction দিয়ে client side থেকে দূর রাখা যেতে পারে।

২। `Builder Pattern` telescoping construction এর প্রবলেম সলভ করে।

৩। `Builder Pattern` ব্যবহার করে building process এর order maintain করা যায় বা step by step object construction method মেথড follow করা যায়।

Full Implementation Link - [Github](https://github.com/simantaturja/Design-Patterns-Implementation/tree/master/BuilderPatternJavaImplementation)

Additional Resources for Reading:

1. Spring Framework Guru - GoF Design Pattern - [Builder Pattern](https://springframework.guru/gang-of-four-design-patterns/builder-pattern/)
2. Refactoring Guru - [Builder Pattern](https://refactoring.guru/design-patterns/builder)
3. More about Telescoping Constructor - Anti Pattern [Link](http://www.captaindebug.com/2011/05/telescoping-constructor-antipattern.html)
