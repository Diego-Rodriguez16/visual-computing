using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerDash : MonoBehaviour
{
    public float moveSpeed = 60f;
    public float jumpForce = 2f;
    public float mouseSensitivity = 2000f;
    public Transform cameraTransform;

    private Rigidbody rb;
    private float rotationY = 0f;

    void Start()
    {
        rb = GetComponent<Rigidbody>();
    }

    void Update()
    {
        // Movimiento normal (sin AddForce)
        float horizontal = Input.GetAxis("Horizontal");
        float vertical = Input.GetAxis("Vertical");
        Vector3 moveDirection = transform.right * horizontal + transform.forward * vertical;
        Vector3 moveVelocity = moveDirection * moveSpeed;
        Vector3 currentVelocity = rb.velocity;
        rb.velocity = new Vector3(moveVelocity.x, currentVelocity.y, moveVelocity.z);

        // salto con clic izquierdo (AddForce)
        if (Input.GetMouseButtonDown(0))
        {
            rb.AddForce(transform.up * jumpForce, ForceMode.Impulse);
        }

        // Rotación horizontal del jugador
        float mouseX = Input.GetAxis("Mouse X") * mouseSensitivity * Time.deltaTime;
        transform.Rotate(Vector3.up * mouseX);

        // Rotación vertical de la cámara
        float mouseY = Input.GetAxis("Mouse Y") * mouseSensitivity * Time.deltaTime;
        rotationY -= mouseY;
        rotationY = Mathf.Clamp(rotationY, -90f, 90f);
        cameraTransform.localRotation = Quaternion.Euler(rotationY, 0f, 0f);
    }
}
