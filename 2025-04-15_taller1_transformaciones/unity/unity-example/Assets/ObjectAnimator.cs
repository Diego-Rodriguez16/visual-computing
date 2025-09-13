using UnityEngine;

public class ObjectAnimator : MonoBehaviour
{
    [Header("Movement")]
    public float moveInterval = 2f;    // how many seconds before changing axis
    public float moveSpeed = 2f;       // units per second
    public bool moveOnXZ = false;      // if true, move on ground plane (X/Z)

    [Header("Rotation")]
    public float rotationSpeedY = 90f; // degrees per second

    [Header("Scaling")]
    public float scaleBase = 1f;
    public float scaleAmplitude = 0.5f; // 0.5 => oscillates between 0.5 and 1.5

    private float nextMoveTime;
    private Vector3 moveDir;

    [Header("Optional Reset")]
    public bool enableReset = false;
    public float resetInterval = 6f; // reset every 6 seconds
    private float nextResetTime;
    private Vector3 initialPos;

    void Start()
    {
        initialPos = transform.position;
        nextResetTime = Time.time + resetInterval;
        PickAxis();
        nextMoveTime = Time.time + moveInterval;
    }

    void Update()
    {
        // 1) Change axis every 'moveInterval' seconds (X or Y) (or X or Z if moveOnXZ)
        if (Time.time >= nextMoveTime)
        {
            PickAxis();
            nextMoveTime = Time.time + moveInterval;
        }

        // Continuous translation with speed (FPS-independent)
        transform.Translate(moveDir * moveSpeed * Time.deltaTime, Space.World);

        // 2) Constant rotation depending on deltaTime
        transform.Rotate(0f, rotationSpeedY * Time.deltaTime, 0f, Space.Self);

        // 3) Oscillating scale with Mathf.Sin(Time.time)
        float s = scaleBase + Mathf.Sin(Time.time) * scaleAmplitude;
        transform.localScale = new Vector3(s, s, s);

        // Optional reset to initial position
        if (enableReset && Time.time >= nextResetTime)
        {
            transform.position = initialPos;
            nextResetTime = Time.time + resetInterval;
        }
    }

    void PickAxis()
    {
        // randomly pick 0 or 1
        int axis = Random.Range(0, 2);
        if (!moveOnXZ)
        {
            // Move along X or Y (as stated in the scenario)
            moveDir = (axis == 0) ? Vector3.right : Vector3.up;
        }
        else
        {
            // Alternative: move on the ground plane (X or Z)
            moveDir = (axis == 0) ? Vector3.right : Vector3.forward;
        }
    }
}
