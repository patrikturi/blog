---
title: "StarCraft Applied to Software Development"
date: 2020-01-11
description: "What you can learn from playing StarCraft that will make you a better programmer"
draft: true
---

[StarCraft](https://starcraft2.com/) is said to be one of the most difficult one versus one computer games. Any player requires a good composure of skills and knowledge not to be outsmarted by his opponent. He also must use his keyboard and mouse as effectively as possible to try to play faster than his challenger.

I realized I've been applying to my work as software developer what I learnt from playing and it could be useful for others as well.

# Three Pillars of the Craft

To be great at the game, one needs to balance mastering three main areas:
1) game **knowledge**
2) **execution** of the strategy
3) real-time **information**

Not being competent in any of these areas will result in a certain defeat.

In software development, "game knowledge" means you obviously have to know what you are doing. Learn about SOLID principles and clean code. Have a good idea about how your code should be organized. Know your libraries and APIs.

Execution means if you can perform up to your capabilities and knowledge. Do you usually get enough sleep before work and manage to get private life off your mind? Do you use an IDE and hotkeys to work efficiently? Can you plan your software projects and stick to the schedule?

Acquiring real-time information is a critical one. Missing the opportunity to get feedback creates products that are hard to use or don't even solve the problem of the users. Keep an eye on the changing market needs and trends as well.

# Mouse Control

Fast and accurate mouse clicks are essential in the game and could speed up the work of a programmer as well. Yes, a decent part of the day we are browsing through online documentation, opening Jira to assign the next task or checking Jenkins to see if our tests passed.

## The Deadly Mouse Setting on Windows

There is a mouse setting on Windows that has been preventing you to use your mouse properly.

It is called *Enhance pointer position*. By default it is turned on, and it makes the mouse pointer move faster if your hand is moving faster. Without this setting your cursor always moves the same amount of pixels for the same distance of mouse movement, making it totally predictable.

```
Enhance pointer position:
  Turned ON: pixels ≈ DPI * distance * speed
  Turned OFF: pixels = DPI * distance
```

This feature makes you slow down when the cursor is approaching its target to be able to click on it precisely.
If you turn it off, after some time you will blindly know where the cursor ends up eg. after 1 cm of movement, so you don't have to slow down the mouse towards your target.

{{< figure src="/img/win10_mouse_properties.png" title="Uncheck \"Enhance pointer position\"" >}}

To disable *Enhance pointer position* on Windows 10, go to Settings > Devices > Mouse > Pointer Options and uncheck it.

## Mouse Sensitivity

Contrary to what most of us think (I used to as well) a really sensitive mouse does not result in getting things done quickly. It means the pointer will move very fast, but when you want to click accurately you must slow down to adjust the position of the cursor precisely. It also results in more misclicks, another waste of time.

Moving the cursor from the left edge to the right edge of the screen should be around 5 centimeters distance your mouse is actually moving on the desk. Actually I think it should be the slowest mouse speed you are still comfortable with. I won't say recommended DPI values because they vary depending on your screen resolution.

# Optimized Input

Needless to say, learning and using many hotkeys is recommended both in games and in programming. However, instead of reaching for a two-hand key combination, it could be better keep your left hand on the keyboard and right hand on the mouse.

For example, in Chrome, the hotkey for "navigate to previous page in history" is Alt + Left, which requires both hands to press it. It is quicker to use a mouse gesture for this, as your right hand is on the mouse when browsing the internet 90% of the time. You don't have to move it to the keyboard and back to the mouse.

# Wrapping Up

These are just a few areas I wanted to share. There are definitely more and I will consider writing a second article. Let me know if I should!

