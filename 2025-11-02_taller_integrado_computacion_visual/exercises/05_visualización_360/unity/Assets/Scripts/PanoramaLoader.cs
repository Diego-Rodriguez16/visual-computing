using UnityEngine;

public class PanoramaLoader : MonoBehaviour
{
    void Start()
    {
        GameObject sphere = GameObject.CreatePrimitive(PrimitiveType.Sphere);
        sphere.transform.localScale = new Vector3(-1, 1, 1); // Invertir normales
        sphere.transform.position = Vector3.zero;

        Texture2D panorama = Resources.Load<Texture2D>("Panoramas/example");
        sphere.GetComponent<Renderer>().material = new Material(Shader.Find("Standard"))
        {
            mainTexture = panorama
        };
    }
}