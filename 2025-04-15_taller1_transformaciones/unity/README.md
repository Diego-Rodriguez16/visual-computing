# 🎮 Unity 3D Animation (Object Transformations)

This project demonstrates **basic object transformations in Unity (LTS version)** using a simple C# script attached to a cube or sphere.  
The animation showcases **translation**, **rotation**, and **scaling**, all handled with Unity’s `Transform` component.

---

![Animation Result](docs/output.gif)

## ✨ Features

- **Random Translation**  
  The object moves along either the **X** or **Y** axis (or optionally **X** and **Z** for ground plane movement).  
  The axis changes every few seconds, based on a configurable interval.  
  Implemented with `transform.Translate()`.

- **Constant Rotation**  
  The object rotates smoothly around its Y-axis.  
  Rotation speed is frame-independent, using `Time.deltaTime`.  
  Implemented with `transform.Rotate()`.

- **Oscillating Scale**  
  The object grows and shrinks smoothly over time using a sine function.  
  Scale oscillates between a minimum and maximum value.  
  Implemented with `transform.localScale`.

- **Optional Reset**  
  The object can reset to its initial position after a configurable time interval.

---

## 📜 Script Overview

The core logic is in the `ObjectAnimator.cs` script:

```csharp
void Update()
{
    // 1) Change axis every 'moveInterval' seconds
    if (Time.time >= nextMoveTime)
    {
        PickAxis();
        nextMoveTime = Time.time + moveInterval;
    }

    // Continuous translation (frame-independent)
    transform.Translate(moveDir * moveSpeed * Time.deltaTime, Space.World);

    // 2) Constant rotation
    transform.Rotate(0f, rotationSpeedY * Time.deltaTime, 0f, Space.Self);

    // 3) Oscillating scale
    float s = scaleBase + Mathf.Sin(Time.time) * scaleAmplitude;
    transform.localScale = new Vector3(s, s, s);

    // Optional reset
    if (enableReset && Time.time >= nextResetTime)
    {
        transform.position = initialPos;
        nextResetTime = Time.time + resetInterval;
    }
}
```

### 🛠️ How to Run

Open Unity Hub → Open the project.

#### Adjust public parameters:

- Move Interval → seconds before changing axis.

- Move Speed → movement speed.

- Rotation Speed Y → rotation in degrees/second.

- Scale Amplitude → how much it scales up and down.

- Enable Reset (optional) → reset to original position.

### Press Play ▶️ in the Unity Editor.

### 🎥 Example Output

The object:

- Moves randomly along X or Y every few seconds.

- Rotates constantly around its Y-axis.

- Scales up and down smoothly like it’s “breathing”.
