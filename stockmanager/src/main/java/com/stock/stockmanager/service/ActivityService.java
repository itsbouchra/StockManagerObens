package com.stock.stockmanager.service;

import java.util.Comparator;
import java.util.List; // Adjust import path if different
import java.util.stream.Collectors; // Adjust import path if different
import java.util.stream.Stream; // Adjust import path if different

import org.springframework.beans.factory.annotation.Autowired; // Adjust import path if different
import org.springframework.stereotype.Service;

import com.stock.stockmanager.dto.RecentActivityDTO;
import com.stock.stockmanager.repository.AchatRepository;
import com.stock.stockmanager.repository.VenteRepository;

@Service
public class ActivityService {

    @Autowired
    private VenteRepository venteRepository;

    @Autowired
    private AchatRepository achatRepository;

    public List<RecentActivityDTO> getAllRecentActivities() {
        List<RecentActivityDTO> ventes = venteRepository.findAll().stream()
                .map(vente -> new RecentActivityDTO("Vente", vente.getMontantTotal(), vente.getDateVente(), (long) vente.getId()))
                .collect(Collectors.toList());

        List<RecentActivityDTO> achats = achatRepository.findAll().stream()
                .map(achat -> new RecentActivityDTO("Achat", achat.getMontantTotal(), achat.getDateAchat(), (long) achat.getId()))
                .collect(Collectors.toList());

        return Stream.concat(ventes.stream(), achats.stream())
                .sorted(Comparator.comparing(RecentActivityDTO::getDate).reversed())
                .collect(Collectors.toList());
    }

    public List<RecentActivityDTO> getTop4RecentActivities() {
        return getAllRecentActivities().stream()
                .limit(4)
                .collect(Collectors.toList());
    }
}
