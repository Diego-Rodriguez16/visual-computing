using UnityEngine;
using UnityEngine.Video;

public class Video360Manager : MonoBehaviour
{
    public VideoClip videoClip;
    public RenderTexture renderTexture;

    void Start()
    {
        GameObject sphere = GameObject.CreatePrimitive(PrimitiveType.Sphere);
        sphere.transform.localScale = new Vector3(-1, 1, 1);
        VideoPlayer vp = sphere.AddComponent<VideoPlayer>();
        vp.source = VideoSource.VideoClip;
        vp.clip = Resources.Load<VideoClip>("Videos/video");
        vp.targetMaterialRenderer = sphere.GetComponent<Renderer>();
        vp.renderMode = VideoRenderMode.MaterialOverride;
        vp.isLooping = true;
        vp.Play();  // Fuerza la reproducción

        // Configura cámara para navegación
        Camera.main.gameObject.AddComponent<PanoramicCamera>();
    }
}