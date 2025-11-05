using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class UIController : MonoBehaviour
{
    public Transform player;
    public TextMeshProUGUI heightText;
    public Slider energyBar;
    public Button resetButton;

    void Start()
    {
        resetButton.onClick.AddListener(ResetPlayer);
    }

    void Update()
    {
        // Mostrar altura actual
        float height = player.position.y;
        heightText.text = $"Altura: {height:F1} m";

        // Simular barra de energía en base a altura
        energyBar.value = height;
    }

    void ResetPlayer()
    {
        player.position = new Vector3(0, 0, 0);
        player.GetComponent<Rigidbody>().velocity = Vector3.zero;
    }
}
