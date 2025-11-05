using UnityEngine;

[RequireComponent(typeof(Camera))]  // Asegura que esté en una cámara
public class PanoramicCamera : MonoBehaviour
{
    [Range(0.1f, 5f)] public float sensitivity = 2f;
    private Vector3 _rotation;

    void Start()
    {
        _rotation = transform.eulerAngles;
        Cursor.lockState = CursorLockMode.Locked;  // Bloquea el ratón en el centro
    }

    void Update()
    {
        // Rotación con mouse
        float mouseX = Input.GetAxis("Mouse X") * sensitivity;
        float mouseY = Input.GetAxis("Mouse Y") * sensitivity;

        _rotation.y += mouseX;
        _rotation.x -= mouseY;
        _rotation.x = Mathf.Clamp(_rotation.x, -90f, 90f);  // Limita ángulo vertical

        transform.rotation = Quaternion.Euler(_rotation.x, _rotation.y, 0);
    }
}